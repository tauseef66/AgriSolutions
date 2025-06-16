import pandas as pd
import pickle
import sys
import json

# Load model and scaler
with open("crop_recommendation_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Feature names
feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

def predict_crop_recommendation(input_data):
    """
    Predict crop based on input data.
    Input: Dict with {N, P, K, temperature, humidity, ph, rainfall}
    Output: Predicted crop (string) or error message
    """
    try:
        # Convert input to DataFrame
        df = pd.DataFrame([input_data], columns=feature_names)
        # Scale input
        scaled_data = scaler.transform(df)
        # Predict
        prediction = model.predict(scaled_data)
        return prediction[0]
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Expect input as JSON string from command line
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])
        result = predict_crop_recommendation(input_data)
        print(json.dumps(result))  # Output as JSON for Node.js