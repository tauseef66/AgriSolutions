const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modelType: {
        type: String,
        enum: ['crop', 'yield', 'fertilizer'],
        required: true
    },
    inputData: {
        type: Object,
        required: true
    },
    predictionResult: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);