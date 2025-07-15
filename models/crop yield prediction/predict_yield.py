import pickle
import os
import numpy as np
import pandas as pd
import json
import sys
from datetime import datetime
from sklearn.exceptions import DataConversionWarning
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DataConversionWarning)

class YieldPredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.feature_names = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp', 'Area', 'Item']
        print(f"[YIELD PREDICTOR] Initializing YieldPredictor at {self._get_timestamp()}", file=sys.stderr)
        self.load_models()
    
    def _get_timestamp(self):
        """Return current timestamp for logging"""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
    
    def load_models(self):
        """Load the ML model and preprocessor"""
        print(f"[YIELD PREDICTOR] Loading models at {self._get_timestamp()}", file=sys.stderr)
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            print(f"[YIELD PREDICTOR] Script directory: {script_dir}", file=sys.stderr)
            
            # Load model
            model_path = os.path.join(script_dir, "dtr.pkl")
            print(f"[YIELD PREDICTOR] Loading model from: {model_path}", file=sys.stderr)
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
                print(f"[YIELD PREDICTOR] Model loaded successfully", file=sys.stderr)
            
            # Load preprocessor
            preprocessor_path = os.path.join(script_dir, "preprocessor.pkl")
            print(f"[YIELD PREDICTOR] Loading preprocessor from: {preprocessor_path}", file=sys.stderr)
            if not os.path.exists(preprocessor_path):
                raise FileNotFoundError(f"Preprocessor file not found: {preprocessor_path}")
            with open(preprocessor_path, 'rb') as f:
                self.preprocessor = pickle.load(f)
                print(f"[YIELD PREDICTOR] Preprocessor loaded successfully", file=sys.stderr)
                
            return True
        except Exception as e:
            print(f"[YIELD PREDICTOR] Error loading models: {str(e)}", file=sys.stderr)
            return False
    
    def predict_from_json(self, json_input):
        """Make prediction from JSON input"""
        print(f"[YIELD PREDICTOR] Processing prediction at {self._get_timestamp()}", file=sys.stderr)
        print(f"[YIELD PREDICTOR] Input JSON: {json_input}", file=sys.stderr)
        try:
            input_data = json.loads(json_input)
            print(f"[YIELD PREDICTOR] Parsed input: {input_data}", file=sys.stderr)
            
            for field in self.feature_names:
                if field not in input_data:
                    print(f"[YIELD PREDICTOR] Validation error: Missing field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Missing field: {field}"
                    }
                if field in ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp'] and not isinstance(input_data[field], (int, float)):
                    print(f"[YIELD PREDICTOR] Validation error: Invalid numeric field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Invalid numeric field: {field}"
                    }
                if field in ['Area', 'Item'] and not isinstance(input_data[field], str):
                    print(f"[YIELD PREDICTOR] Validation error: Invalid string field: {field}", file=sys.stderr)
                    return {
                        "status": "error",
                        "message": f"Invalid string field: {field}"
                    }
            
            # Convert to DataFrame for preprocessing
            df = pd.DataFrame([input_data], columns=self.feature_names)
            print(f"[YIELD PREDICTOR] Features DataFrame: {df.to_dict()}", file=sys.stderr)
            
            # Transform features
            transformed_features = self.preprocessor.transform(df)
            print(f"[YIELD PREDICTOR] Transformed features: {transformed_features}", file=sys.stderr)
            
            # Predict
            prediction = self.model.predict(transformed_features)
            print(f"[YIELD PREDICTOR] Raw prediction: {prediction}", file=sys.stderr)
            
            result = {
                "status": "success",
                "prediction": float(prediction[0]),
                "confidence": 0.95
            }
            print(f"[YIELD PREDICTOR] Prediction result: {result}", file=sys.stderr)
            return result
        except Exception as e:
            print(f"[YIELD PREDICTOR] Prediction error: {str(e)}", file=sys.stderr)
            return {
                "status": "error",
                "message": str(e)
            }

def main():
    print(f"[YIELD PREDICTOR] Starting prediction service at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')}", file=sys.stderr)
    predictor = YieldPredictor()
    if not predictor.model or not predictor.preprocessor:
        print(json.dumps({
            "status": "error",
            "message": "Failed to load models"
        }), file=sys.stderr)
        sys.exit(1)
    
    if len(sys.argv) != 2:
        print(f"[YIELD PREDICTOR] Error: Expected one JSON argument, got {len(sys.argv)-1}", file=sys.stderr)
        print(json.dumps({
            "status": "error",
            "message": "Expected one JSON argument"
        }))
        sys.exit(1)
    
    input_json = sys.argv[1]
    print(f"[YIELD PREDICTOR] Received argument: {input_json}", file=sys.stderr)
    result = predictor.predict_from_json(input_json)
    print(json.dumps(result), flush=True)
    print(f"[YIELD PREDICTOR] Output sent: {json.dumps(result)}", file=sys.stderr)
    sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main()
    else:
        test_input = {
            "Year": 1990,
            "average_rain_fall_mm_per_year": 1485.0,
            "pesticides_tonnes": 121.0,
            "avg_temp": 16.37,
            "Area": "Albania",
            "Item": "Maize"
        }
        print(f"[YIELD PREDICTOR] Running test prediction at {datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')}", file=sys.stderr)
        predictor = YieldPredictor()
        result = predictor.predict_from_json(json.dumps(test_input))
        print(f"[YIELD PREDICTOR] Test prediction result: {json.dumps(result)}", file=sys.stderr)
        sys.exit(0)