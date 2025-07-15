const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const predictYield = async (inputData) => {
  console.log('[YIELD SERVICE] Starting yield prediction at', new Date().toISOString());
  console.log('[YIELD SERVICE] Input:', JSON.stringify(inputData, null, 2));
  
  const requiredFields = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp', 'Area', 'Item'];
  
  for (const field of requiredFields) {
    if (!inputData[field]) {
      console.error(`[YIELD SERVICE] Validation error: Missing field: ${field}`);
      throw new Error(`Missing field: ${field}`);
    }
  }
  // Validate numeric fields
  const numericFields = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp'];
  for (const field of numericFields) {
    if (typeof inputData[field] !== 'number') {
      console.error(`[YIELD SERVICE] Validation error: Invalid numeric field: ${field}`);
      throw new Error(`Invalid numeric field: ${field}`);
    }
  }
  // Validate string fields
  if (typeof inputData.Area !== 'string' || typeof inputData.Item !== 'string') {
    console.error('[YIELD SERVICE] Validation error: Invalid string field: Area or Item');
    throw new Error('Invalid string field: Area or Item');
  }

  const scriptPath = path.resolve(__dirname, '../../models/crop yield prediction');
  console.log('[YIELD SERVICE] Resolved script path:', scriptPath);

  const scriptFile = path.join(scriptPath, 'predict_yield.py');
  if (!fs.existsSync(scriptFile)) {
    console.error(`[YIELD SERVICE] Script file not found: ${scriptFile}`);
    throw new Error(`Python script not found at: ${scriptFile}`);
  }
  console.log('[YIELD SERVICE] Script file exists:', scriptFile);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: 'C:\\Users\\Tauseef Ahmad Ghug\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
    scriptPath,
    args: [JSON.stringify(inputData)],
    timeout: 10000
  };

  console.log('[YIELD SERVICE] PythonShell options:', JSON.stringify(options, null, 2));

  return new Promise((resolve, reject) => {
    const shell = new PythonShell('predict_yield.py', options);
    
    let output = '';
    shell.on('message', (message) => {
      console.log('[YIELD SERVICE] Python output:', message);
      output += message + '\n';
    });

    shell.on('stderr', (stderr) => {
      console.error('[YIELD SERVICE] Python stderr:', stderr);
    });

    shell.on('close', (code) => {
      console.log('[YIELD SERVICE] PythonShell closed with code:', code);
      try {
        if (!output.trim()) {
          return reject(new Error('No output received from Python script'));
        }
        const result = JSON.parse(output.trim());
        if (result.status === 'error') {
          console.error(`[YIELD SERVICE] Prediction error: ${result.message}`);
          return reject(new Error(result.message));
        }
        console.log('[YIELD SERVICE] Prediction successful:', result);
        resolve(result);
      } catch (parseErr) {
        console.error(`[YIELD SERVICE] Parse error: ${parseErr.message}`);
        reject(new Error(`Failed to parse prediction result: ${parseErr.message}`));
      }
    });

    shell.on('error', (error) => {
      console.error(`[YIELD SERVICE] PythonShell error: ${error.message}`);
      reject(new Error(`PythonShell error: ${error.message}`));
    });
  });
};

module.exports = { predictYield };