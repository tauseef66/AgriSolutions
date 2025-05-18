const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Helper function to make predictions
const makePrediction = async (endpoint, data) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to make prediction');
    }
};

// Crop Recommendation
exports.predictCrop = async (req, res) => {
    try {
        const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

        // Validate input
        if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const result = await makePrediction('/predict/crop', {
            N, P, K, temperature, humidity, ph, rainfall
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Crop Yield Prediction
exports.predictYield = async (req, res) => {
    try {
        const { crop, area, rainfall, temperature, soil_type } = req.body;

        // Validate input
        if (!crop || !area || !rainfall || !temperature || !soil_type) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const result = await makePrediction('/predict/yield', {
            crop, area, rainfall, temperature, soil_type
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Fertilizer Recommendation
exports.predictFertilizer = async (req, res) => {
    try {
        const {
            crop, temperature, humidity, moisture, soil_type,
            nitrogen, potassium, phosphorous
        } = req.body;

        // Validate input
        if (!crop || !temperature || !humidity || !moisture || !soil_type ||
            !nitrogen || !potassium || !phosphorous) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const result = await makePrediction('/predict/fertilizer', {
            crop, temperature, humidity, moisture, soil_type,
            nitrogen, potassium, phosphorous
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 