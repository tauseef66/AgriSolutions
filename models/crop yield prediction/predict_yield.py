import pickle
import numpy as np
import pandas as pd
import warnings
import os
import sys
import json
from sklearn.exceptions import DataConversionWarning

# Suppress sklearn warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DataConversionWarning)

def load_models():
    """Load the saved model and preprocessor with absolute paths"""
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct absolute paths to model files
    dtr_path = os.path.join(script_dir, 'dtr.pkl')
    preprocessor_path = os.path.join(script_dir, 'preprocessor.pkl')
    
    try:
        with open(dtr_path, 'rb') as f:
            model = pickle.load(f)
        with open(preprocessor_path, 'rb') as f:
            preprocessor = pickle.load(f)
        return model, preprocessor
    except FileNotFoundError as e:
        print(f"Model files not found at: {dtr_path} or {preprocessor_path}")
        raise

def predict_yield(input_data):
    """Make a prediction using the loaded model"""
    model, preprocessor = load_models()
    
    # Create DataFrame from input
    df = pd.DataFrame([input_data], columns=[
        'Year', 'average_rain_fall_mm_per_year', 
        'pesticides_tonnes', 'avg_temp', 
        'Area', 'Item'
    ])
    
    # Preprocess and predict
    transformed = preprocessor.transform(df)
    return float(model.predict(transformed)[0])

if __name__ == "__main__":
    # Get input from command line arguments
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            prediction = predict_yield(input_data)
            print(prediction)
        except json.JSONDecodeError as e:
            print(json.dumps({"status": "error", "message": f"Invalid JSON input: {str(e)}"}))
            sys.exit(1)
        except Exception as e:
            print(json.dumps({"status": "error", "message": str(e)}))
            sys.exit(1)
    else:
        # For testing without arguments
        example_data = {
            'Year': 1990,
            'average_rain_fall_mm_per_year': 1485.0,
            'pesticides_tonnes': 121.00,
            'avg_temp': 16.37,
            'Area': 'Albania',
            'Item': 'Sorghum'
        }
        prediction = predict_yield(example_data)
        print(prediction)