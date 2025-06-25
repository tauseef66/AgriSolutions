const { PythonShell } = require('python-shell');

const predictYield = async (inputData) => {
  const requiredFields = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp', 'Area', 'Item'];
  
  // Validate input
  for (const field of requiredFields) {
    if (!inputData[field]) {
      throw new Error(`Missing field: ${field}`);
    }
  }
  // Validate numeric fields
  const numericFields = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp'];
  for (const field of numericFields) {
    if (typeof inputData[field] !== 'number') {
      throw new Error(`Invalid type for ${field}: expected number`);
    }
  }
  // Validate string fields
  if (typeof inputData.Area !== 'string' || typeof inputData.Item !== 'string') {
    throw new Error('Invalid type for Area or Item: expected string');
  }

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: '../models/crop yield prediction',
    args: [JSON.stringify(inputData)]
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('predict_yield.py', options, (err, results) => {
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

module.exports = { predictYield };