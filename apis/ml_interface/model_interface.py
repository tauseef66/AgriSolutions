import joblib
import pandas as pd
import numpy as np
import os
from pathlib import Path

class MLModels:
    def __init__(self):
        # Get the absolute path to the models directory
        current_file = os.path.abspath(__file__)
        apis_dir = os.path.dirname(os.path.dirname(current_file))
        self.models_path = os.path.join(os.path.dirname(apis_dir), 'models')
        print(f"Models path: {self.models_path}")  # Debug print
        self.load_models()

    def load_models(self):
        try:
            # Print debug information
            crop_rec_path = os.path.join(self.models_path, 'crop_recommendation', 'model.joblib')
            crop_yield_path = os.path.join(self.models_path, 'crop_yield', 'model.joblib')
            fertilizer_path = os.path.join(self.models_path, 'fertilizer', 'model.joblib')
            
            print(f"Looking for models at:")
            print(f"Crop Recommendation: {crop_rec_path}")
            print(f"Crop Yield: {crop_yield_path}")
            print(f"Fertilizer: {fertilizer_path}")

            # Check if files exist
            if not os.path.exists(crop_rec_path):
                raise FileNotFoundError(f"Crop recommendation model not found at {crop_rec_path}")
            if not os.path.exists(crop_yield_path):
                raise FileNotFoundError(f"Crop yield model not found at {crop_yield_path}")
            if not os.path.exists(fertilizer_path):
                raise FileNotFoundError(f"Fertilizer model not found at {fertilizer_path}")

            # Load the models
            self.crop_recommendation_model = joblib.load(crop_rec_path)
            self.crop_yield_model = joblib.load(crop_yield_path)
            self.fertilizer_model = joblib.load(fertilizer_path)
            
            print("All models loaded successfully!")

        except Exception as e:
            print(f"Error loading models: {e}")
            raise

    def predict_crop_recommendation(self, data):
        """
        Input data should contain: N, P, K, temperature, humidity, ph, rainfall
        """
        try:
            print(f"Received data for crop recommendation: {data}")  # Debug print
            input_data = pd.DataFrame([data])
            print(f"Input DataFrame shape: {input_data.shape}")  # Debug print
            prediction = self.crop_recommendation_model.predict(input_data)
            print(f"Prediction result: {prediction}")  # Debug print
            return prediction[0]
        except Exception as e:
            print(f"Error in crop recommendation: {e}")
            raise

    def predict_crop_yield(self, data):
        """
        Input data should contain: area, item, year, rainfall, pesticides, temperature
        """
        try:
            print(f"Received data for crop yield: {data}")  # Debug print
            # Convert item to one-hot encoding
            input_data = pd.DataFrame([data])
            input_data = pd.get_dummies(input_data, columns=['item'])
            prediction = self.crop_yield_model.predict(input_data)
            return float(prediction[0])
        except Exception as e:
            print(f"Error in crop yield prediction: {e}")
            raise

    def recommend_fertilizer(self, data):
        """
        Input data should contain: soil_type, crop_type, N, P, K
        """
        try:
            print(f"Received data for fertilizer recommendation: {data}")  # Debug print
            # Convert categorical variables to one-hot encoding
            input_data = pd.DataFrame([data])
            input_data = pd.get_dummies(input_data, columns=['soil_type', 'crop_type'])
            prediction = self.fertilizer_model.predict(input_data)
            return prediction[0]
        except Exception as e:
            print(f"Error in fertilizer recommendation: {e}")
            raise 