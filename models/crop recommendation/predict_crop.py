
import pickle
import os
import numpy as np
import json
import sys
from datetime import datetime
from sklearn.exceptions import DataConversionWarning
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DataConversionWarning)

class CropPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        print(f"[CROP PREDICTOR] Initializing CropPredictor at {self._get_timestamp()}", file=sys.stderr)
        self.load_models()
    
    def _get_timestamp(self):
        """Return current timestamp for logging"""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
    
    def load_models(self):
        """Load the ML model and scaler"""
        print(f"[CROP PREDICTOR] Loading models at {self._get_timestamp()}", file=sys.stderr)
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            print(f"[CROP PREDICTOR] Script directory: {script_dir}", file=sys.stderr)
            
            # Load model
            model_path = os.path.join(script_dir, "crop_recommendation_model.pkl")
            print(f"[CROP PREDICTOR] Loading model from: {model_path}", file=sys.stderr)
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
                print(f"[CROP PREDICTOR] Model loaded successfully", file=sys.stderr)
            
            # Load scaler
            scaler_path = os.path.join(script_dir, "scaler.pkl")
            print(f"[CROP PREDICTOR] Loading scaler from: {scaler_path}", file=sys.stderr)
            if not os.path.exists(scaler_path):
                raise FileNotFoundError(f"Scaler file not found: {scaler_path}")
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
                print(f"[CROP PREDICTOR] Scaler loaded successfully", file=sys.stderr)
                
            return True
        except Exception as e:
            print(f"[CROP PREDICTOR] Error loading models: {str(e)}", file=sys.stderr)
            return False
    
    def predict_from_json(self, json_input):
        """Make prediction from JSON input"""
        print(f"[CROP PREDICTOR] Processing prediction at {self._get_timestamp()}", file=sys.stderr)
        print(f"[CROP PREDICTOR] Input JSON: {json_input}", file=sys.stderr)
        try:
            input_data = json.loads(json_input)
            print(f"[CROP PREDICTOR] Parsed input: {input_data}", file=sys.stderr)
            
            for field in self.feature_names:
                if field not in input_data or not isinstance(input_data[field], (int, float)):
                    print(f"[CROP PREDICTOR] Validation error: Missing or invalid field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Missing or invalid field: {field}"
                    }
            
            features = np.array([
                input_data['N'],
                input_data['P'],
                input_data['K'],
                input_data['temperature'],
                input_data['humidity'],
                input_data['ph'],
                input_data['rainfall']
            ]).reshape(1, -1)
            print(f"[CROP PREDICTOR] Features array: {features}", file=sys.stderr)
            
            scaled_features = self.scaler.transform(features)
            print(f"[CROP PREDICTOR] Scaled features: {scaled_features}", file=sys.stderr)
            prediction = self.model.predict(scaled_features)
            print(f"[CROP PREDICTOR] Raw prediction: {prediction}", file=sys.stderr)
            
            result = {
                "status": "success",
                "prediction": prediction[0],
                "confidence": 0.95
            }
            print(f"[CROP PREDICTOR] Prediction result: {result}", file=sys.stderr)
            return result
        except Exception as e:
            print(f"[CROP PREDICTOR] Prediction error: {str(e)}", file=sys.stderr)
            return {
                "status": "error",
                "message": str(e)
            }

def main():
    print(f"[CROP PREDICTOR] Starting prediction service at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')}", file=sys.stderr)
    predictor = CropPredictor()
    if not predictor.model or not predictor.scaler:
        print(json.dumps({
            "status": "error",
            "message": "Failed to load models"
        }), file=sys.stderr)
        sys.exit(1)
    
    if len(sys.argv) != 2:
        print(f"[CROP PREDICTOR] Error: Expected one JSON argument, got {len(sys.argv)-1}", file=sys.stderr)
        print(json.dumps({
            "status": "error",
            "message": "Expected one JSON argument"
        }))
        sys.exit(1)
    
    input_json = sys.argv[1]
    print(f"[CROP PREDICTOR] Received argument: {input_json}", file=sys.stderr)
    result = predictor.predict_from_json(input_json)
    print(json.dumps(result), flush=True)
    print(f"[CROP PREDICTOR] Output sent: {json.dumps(result)}", file=sys.stderr)
    sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main()
    else:
        test_input = {
            "N": 36,
            "P": 43,
            "K": 21,
            "temperature": 28.36,
            "humidity": 84.86,
            "ph": 7.14,
            "rainfall": 52.93
        }
        print(f"[CROP PREDICTOR] Running test prediction at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')}", file=sys.stderr)
        predictor = CropPredictor()
        result = predictor.predict_from_json(json.dumps(test_input))
        print(f"[CROP PREDICTOR] Test prediction result: {json.dumps(result)}", file=sys.stderr)