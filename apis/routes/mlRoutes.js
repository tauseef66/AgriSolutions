const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Helper function to run Python predictions
const runPythonPrediction = (modelFunction, data) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
            path.join(__dirname, '..', 'ml_interface', 'predict.py'),
            modelFunction,
            JSON.stringify(data)
        ]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${error}`));
            } else {
                try {
                    resolve(JSON.parse(result));
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${result}`));
                }
            }
        });
    });
};

// Crop Recommendation API
router.post('/crop-recommendation', async (req, res) => {
    try {
        const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
        
        // Input validation
        if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
            return res.status(400).json({ error: 'All parameters are required' });
        }

        const prediction = await runPythonPrediction('predict_crop_recommendation', req.body);
        res.json({ recommendation: prediction });
    } catch (error) {
        console.error('Crop Recommendation Error:', error);
        res.status(500).json({ error: 'Failed to get crop recommendation' });
    }
});

// Crop Yield Prediction API
router.post('/crop-yield', async (req, res) => {
    try {
        const { area, item, year, rainfall, pesticides, temperature } = req.body;
        
        // Input validation
        if (!area || !item || !year || !rainfall || !pesticides || !temperature) {
            return res.status(400).json({ error: 'All parameters are required' });
        }

        const prediction = await runPythonPrediction('predict_crop_yield', req.body);
        res.json({ predicted_yield: prediction });
    } catch (error) {
        console.error('Crop Yield Prediction Error:', error);
        res.status(500).json({ error: 'Failed to predict crop yield' });
    }
});

// Fertilizer Recommendation API
router.post('/fertilizer-recommendation', async (req, res) => {
    try {
        const { soil_type, crop_type, N, P, K } = req.body;
        
        // Input validation
        if (!soil_type || !crop_type || !N || !P || !K) {
            return res.status(400).json({ error: 'All parameters are required' });
        }

        const prediction = await runPythonPrediction('recommend_fertilizer', req.body);
        res.json({ recommendation: prediction });
    } catch (error) {
        console.error('Fertilizer Recommendation Error:', error);
        res.status(500).json({ error: 'Failed to get fertilizer recommendation' });
    }
});

module.exports = router; 