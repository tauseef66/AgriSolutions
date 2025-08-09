const { predictYield } = require('../services/yieldService');
const Prediction = require('../models/prediction');

const predictYieldRecommendation = async (req, res) => {
  try {
    const inputData = req.body;
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const userId = req.user.id;

    const result = await predictYield(inputData);
    console.log(result);
    const prediction = new Prediction({
      userId,
      modelType: 'yield',
      inputData,
      // predictionResult: {
      //   yield: result.prediction,
      //   confidence: result.confidence
      // }
      predictionResult : {
        yield : result,
        confidence : 0.95 
      }
    });
    console.log(prediction);
    await prediction.save();
    console.log('[YIELD CONTROLLER] Prediction saved:', prediction._id);

    res.status(200).json({ yield: result });
  } catch (error) {
    console.error('[YIELD CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictYieldRecommendation };





 

// const { predictYield } = require('../services/yieldService');
// const Prediction = require('../models/Prediction');

// const predictYieldRecommendation = async (req, res) => {
//   try {
//     if (!req.user) {
//       throw new Error('Authentication required');
//     }
//     const userId = req.user.id;
//     const inputData = req.body;

//     const result = await predictYield(inputData);
//     console.log('[YIELD CONTROLLER] predictYield result:', JSON.stringify(result, null, 2));

//     // Validate result
//     // if (!result || !Number.isFinite(result.prediction) || !Number.isFinite(result.confidence)) {
//     //   console.error('[YIELD CONTROLLER] Invalid prediction result:', result);
//     //   throw new Error('Invalid prediction result: missing or invalid prediction or confidence');
//     // }

//     const prediction = new Prediction({
//       userId,
//       modelType: 'yield',
//       inputData,
//       predictionResult: {
//         yield: result.prediction,
//         confidence: result.confidence
//       }
//     });

//     console.log(prediction);
//     await prediction.save();
//     console.log('[YIELD CONTROLLER] Prediction saved:', prediction._id, 'predictionResult:', JSON.stringify(prediction.predictionResult, null, 2));

//     res.status(200).json({
//       status: 'success',
//       data: {
//         yield: result.prediction,
//         confidence: result.confidence
//       }
//     });
//   } catch (error) {
//     console.error('[YIELD CONTROLLER] Error:', error.message, error.stack);
//     res.status(400).json({ status: 'error', message: error.message });
//   }
// };

// module.exports = { predictYieldRecommendation };