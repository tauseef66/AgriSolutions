const { PythonShell } = require('python-shell');

const predictCrop = async (inputData) => {
  const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
  
  // Validate input
  for (const field of requiredFields) {
    if (!inputData[field] || typeof inputData[field] !== 'number') {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: '../models/crop recommendation',
    args: [JSON.stringify(inputData)]
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('predict_crop.py', options, (err, results) => {
      if (err) {
        return reject(new Error(`Prediction failed: ${err.message}`));
      }
      try {
        const result = JSON.parse(results[0]);
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result);
      } catch (parseErr) {
        reject(new Error(`Failed to parse prediction result: ${parseErr.message}`));
      }
    });
  });
};

module.exports = { predictCrop };