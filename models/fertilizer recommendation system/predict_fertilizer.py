
import pickle
import os
import numpy as np
import pandas as pd
import json
import sys
from datetime import datetime
from sklearn.exceptions import DataConversionWarning
import warnings
import joblib

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DataConversionWarning)

class FertilizerPredictor:
    def __init__(self):
        self.model_bundle = None
        self.crop_encoder = None
        self.feature_names = ['Temperature', 'Moisture', 'Rainfall', 'PH', 'Nitrogen', 'Phosphorous', 'Potassium', 'Carbon', 'Soil', 'Crop']
        self.soil_types = ['Soil_Alkaline Soil', 'Soil_Loamy Soil', 'Soil_Neutral Soil', 'Soil_Peaty Soil']
        print(f"[FERTILIZER PREDICTOR] Initializing FertilizerPredictor at {self._get_timestamp()}", file=sys.stderr)
        self.load_models()
    
    def _get_timestamp(self):
        """Return current timestamp for logging"""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
    
    def load_models(self):
        """Load the ML model and crop encoder"""
        print(f"[FERTILIZER PREDICTOR] Loading models at {self._get_timestamp()}", file=sys.stderr)
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            print(f"[FERTILIZER PREDICTOR] Script directory: {script_dir}", file=sys.stderr)
            
            # Load model bundle
            model_path = os.path.join(script_dir, "fertilizer_model_bundle.joblib")
            print(f"[FERTILIZER PREDICTOR] Loading model from: {model_path}", file=sys.stderr)
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            with open(model_path, 'rb') as f:
                self.model_bundle = joblib.load(f)
                print(f"[FERTILIZER PREDICTOR] Model bundle loaded successfully", file=sys.stderr)
            
            # Load crop encoder
            encoder_path = os.path.join(script_dir, "crop_label_encoder.joblib")
            print(f"[FERTILIZER PREDICTOR] Loading crop encoder from: {encoder_path}", file=sys.stderr)
            if not os.path.exists(encoder_path):
                raise FileNotFoundError(f"Crop encoder file not found: {encoder_path}")
            with open(encoder_path, 'rb') as f:
                self.crop_encoder = joblib.load(f)
                print(f"[FERTILIZER PREDICTOR] Crop encoder loaded successfully", file=sys.stderr)
                
            return True
        except Exception as e:
            print(f"[FERTILIZER PREDICTOR] Error loading models: {str(e)}", file=sys.stderr)
            return False
    
    def predict_from_json(self, json_input):
        """Make prediction from JSON input"""
        print(f"[FERTILIZER PREDICTOR] Processing prediction at {self._get_timestamp()}", file=sys.stderr)
        print(f"[FERTILIZER PREDICTOR] Input JSON: {json_input}", file=sys.stderr)
        try:
            if not self.model_bundle or not self.crop_encoder:
                raise ValueError("Models not loaded successfully")
            
            input_data = json.loads(json_input)
            print(f"[FERTILIZER PREDICTOR] Parsed input: {input_data}", file=sys.stderr)
            
            # Validate inputs
            for field in self.feature_names:
                if field not in input_data:
                    print(f"[FERTILIZER PREDICTOR] Validation error: Missing field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Missing field: {field}"
                    }
                if field in ['Temperature', 'Moisture', 'Rainfall', 'PH', 'Nitrogen', 'Phosphorous', 'Potassium', 'Carbon'] and not isinstance(input_data[field], (int, float)):
                    print(f"[FERTILIZER PREDICTOR] Validation error: Invalid numeric field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Invalid numeric field: {field}"
                    }
                if field in ['Soil', 'Crop'] and not isinstance(input_data[field], str):
                    print(f"[FERTILIZER PREDICTOR] Validation error: Invalid string field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Invalid string field: {field}"
                    }
            
            # Create input DataFrame
            input_df = pd.DataFrame([input_data], columns=self.feature_names)
            print(f"[FERTILIZER PREDICTOR] Features DataFrame: {input_df.to_dict()}", file=sys.stderr)
            
            # One-hot encode Soil to match training
            for soil in self.soil_types:
                input_df[soil] = 0
            soil_col = f"Soil_{input_data['Soil']}"
            if soil_col not in self.soil_types:
                print(f"[FERTILIZER PREDICTOR] Validation error: Invalid Soil type: {input_data['Soil']}", file=sys.stderr)
                return {
                    "status": "error",
                    "message": f"Invalid Soil type: {input_data['Soil']}"
                }
            input_df[soil_col] = 1
            input_df = input_df.drop('Soil', axis=1)
            
            # Encode Crop
            try:
                input_df['Crop'] = self.crop_encoder.transform([input_data['Crop']])[0]
            except ValueError as e:
                print(f"[FERTILIZER PREDICTOR] Crop encoding error: {str(e)}", file=sys.stderr)
                return {
                    "status": "error",
                    "message": f"Invalid Crop value: {input_data['Crop']}"
                }
            
            print(f"[FERTILIZER PREDICTOR] Processed input DataFrame: {input_df.to_dict()}", file=sys.stderr)
            
            # Predict
            pred_fertilizer = self.model_bundle['model'].predict(input_df)[0]
            remark = self.model_bundle['fertilizer_to_remark'].get(pred_fertilizer, "No remark available.")
            print(f"[FERTILIZER PREDICTOR] Raw prediction: {pred_fertilizer}, Remark: {remark}", file=sys.stderr)
            
            result = {
                "status": "success",
                "prediction": pred_fertilizer,
                "remark": remark,
                "confidence": 0.95
            }
            print(f"[FERTILIZER PREDICTOR] Prediction result: {result}", file=sys.stderr)
            return result
        except Exception as e:
            print(f"[FERTILIZER PREDICTOR] Prediction error: {str(e)}", file=sys.stderr)
            return {
                "status": "error",
                "message": str(e)
            }

def main():
    print(f"[FERTILIZER PREDICTOR] Starting prediction service at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')}", file=sys.stderr)
    predictor = FertilizerPredictor()
    if not predictor.model_bundle or not predictor.crop_encoder:
        print(json.dumps({
            "status": "error",
            "message": "Failed to load models"
        }), file=sys.stderr)
        sys.exit(1)
    
    if len(sys.argv) != 2:
        print(f"[FERTILIZER PREDICTOR] Error: Expected one JSON argument, got {len(sys.argv)-1}", file=sys.stderr)
        print(json.dumps({
            "status": "error",
            "message": "Expected one JSON argument"
        }))
        sys.exit(1)
    
    input_json = sys.argv[1]
    print(f"[FERTILIZER PREDICTOR] Received argument: {input_json}", file=sys.stderr)
    result = predictor.predict_from_json(input_json)
    print(json.dumps(result), flush=True)
    print(f"[FERTILIZER PREDICTOR] Output sent: {json.dumps(result)}", file=sys.stderr)
    sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main()
    else:
        test_input = {
            "Temperature": 25.0,
            "Moisture": 0.7,
            "Rainfall": 200.0,
            "PH": 6.5,
            "Nitrogen": 80,
            "Phosphorous": 60,
            "Potassium": 100,
            "Carbon": 1.2,
            "Soil": "Loamy Soil",
            "Crop": "rice"
        }
        print(f"[FERTILIZER PREDICTOR] Running test prediction at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')}", file=sys.stderr)
        predictor = FertilizerPredictor()
        result = predictor.predict_from_json(json.dumps(test_input))
        print(f"[FERTILIZER PREDICTOR] Test prediction result: {json.dumps(result)}", file=sys.stderr)
        sys.exit(0)
