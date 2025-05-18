from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load models
base_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models')

# Crop Recommendation Model
crop_model_path = os.path.join(base_path, 'crop recommendation', 'crop_recommendation_model.pkl')
crop_scaler_path = os.path.join(base_path, 'crop recommendation', 'scaler.pkl')
crop_model = pickle.load(open(crop_model_path, 'rb'))
crop_scaler = pickle.load(open(crop_scaler_path, 'rb'))

# Crop Yield Model
yield_model_path = os.path.join(base_path, 'crop yield prediction', 'dtr.pkl')
yield_preprocessor_path = os.path.join(base_path, 'crop yield prediction', 'preprocessor.pkl')
yield_model = pickle.load(open(yield_model_path, 'rb'))
yield_preprocessor = pickle.load(open(yield_preprocessor_path, 'rb'))

# Fertilizer Recommendation Model
fertilizer_model_path = os.path.join(base_path, 'fertilizer recommendation system', 'fertilizer_model_bundle.joblib')
crop_encoder_path = os.path.join(base_path, 'fertilizer recommendation system', 'crop_label_encoder.joblib')
fertilizer_model = joblib.load(fertilizer_model_path)
crop_encoder = joblib.load(crop_encoder_path)

@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    try:
        data = request.get_json()
        features = [
            data['N'], data['P'], data['K'], data['temperature'],
            data['humidity'], data['ph'], data['rainfall']
        ]
        
        # Scale features
        scaled_features = crop_scaler.transform([features])
        prediction = crop_model.predict(scaled_features)
        
        return jsonify({
            'success': True,
            'prediction': prediction[0]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/predict/yield', methods=['POST'])
def predict_yield():
    try:
        data = request.get_json()
        features = pd.DataFrame({
            'crop': [data['crop']],
            'area': [data['area']],
            'rainfall': [data['rainfall']],
            'temperature': [data['temperature']],
            'soil_type': [data['soil_type']]
        })
        
        # Preprocess features
        processed_features = yield_preprocessor.transform(features)
        prediction = yield_model.predict(processed_features)
        
        return jsonify({
            'success': True,
            'prediction': float(prediction[0])
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/predict/fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        data = request.get_json()
        features = pd.DataFrame({
            'Crop': [data['crop']],
            'Temperature': [data['temperature']],
            'Humidity': [data['humidity']],
            'Moisture': [data['moisture']],
            'Soil Type': [data['soil_type']],
            'Nitrogen': [data['nitrogen']],
            'Potassium': [data['potassium']],
            'Phosphorous': [data['phosphorous']]
        })
        
        # Encode crop
        features['Crop'] = crop_encoder.transform(features['Crop'])
        prediction = fertilizer_model.predict(features)
        
        return jsonify({
            'success': True,
            'prediction': prediction[0]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port) 