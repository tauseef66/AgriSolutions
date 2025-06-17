import pandas as pd
import pickle
import sys
import json

# Load model and preprocessor
with open("dtr.pkl", "rb") as f:
    model = pickle.load(f)

with open("preprocessor.pkl", "rb") as f:
    preprocessor = pickle.load(f)

# Feature names
feature_names = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp', 'Area', 'Item']

def predict_yield(input_data):
    """
    Predict crop yield based on input data.
    Input: Dict with {Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item}
    Output: Predicted yield (float) or error message
    """
    try:
        # Convert input to DataFrame
        df = pd.DataFrame([input_data], columns=feature_names)
        # Transform input
        transformed_data = preprocessor.transform(df)
        # Predict
        prediction = model.predict(transformed_data)
        return float(prediction[0])  # Ensure JSON-serializable output
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Expect input as JSON string from command line
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])
        result = predict_yield(input_data)
        print(json.dumps(result))