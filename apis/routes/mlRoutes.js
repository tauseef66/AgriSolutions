const express = require('express');
const router = express.Router();
const { predictCrop, predictYield, predictFertilizer } = require('../controllers/mlController');

router.post('/predict/crop', predictCrop);
router.post('/predict/yield', predictYield);
router.post('/predict/fertilizer', predictFertilizer);

module.exports = router; 