import joblib
import pandas as pd
import numpy as np
from pathlib import Path

class MLModels:
    def __init__(self):
        self.models_path = Path(__file__).parent.parent.parent / 'models'
        self.load_models()

    def load_models(self):
        # Load your models here
        try:
            self.crop_recommendation_model = joblib.load(
                self.models_path / 'crop recommendation' / 'model.joblib'
            )
            self.crop_yield_model = joblib.load(
                self.models_path / 'crop yield prediction' / 'model.joblib'
            )
            self.fertilizer_model = joblib.load(
                self.models_path / 'fertilizer recommendation system' / 'model.joblib'
            )
        except Exception as e:
            print(f"Error loading models: {e}")
            raise

    def predict_crop_recommendation(self, data):
        """
        Input data should contain: N, P, K, temperature, humidity, ph, rainfall
        """
        try:
            input_data = pd.DataFrame([data])
            prediction = self.crop_recommendation_model.predict(input_data)
            return prediction[0]
        except Exception as e:
            print(f"Error in crop recommendation: {e}")
            raise

    def predict_crop_yield(self, data):
        """
        Input data should contain: area, item, year, rainfall, pesticides, temperature
        """
        try:
            input_data = pd.DataFrame([data])
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
            input_data = pd.DataFrame([data])
            prediction = self.fertilizer_model.predict(input_data)
            return prediction[0]
        except Exception as e:
            print(f"Error in fertilizer recommendation: {e}")
            raise 