const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const predictFertilizer = async (inputData) => {
  console.log('[FERTILIZER SERVICE] Starting fertilizer prediction at', new Date().toISOString());
  console.log('[FERTILIZER SERVICE] Input:', JSON.stringify(inputData, null, 2));
  
  const requiredFields = ['Temperature', 'Moisture', 'Rainfall', 'PH', 'Nitrogen', 'Phosphorous', 'Potassium', 'Carbon', 'Soil', 'Crop'];
  
  for (const field of requiredFields) {
    if (!inputData[field]) {
      console.error(`[FERTILIZER SERVICE] Validation error: Missing field: ${field}`);
      throw new Error(`Missing field: ${field}`);
    }
    if (['Temperature', 'Moisture', 'Rainfall', 'PH', 'Nitrogen', 'Phosphorous', 'Potassium', 'Carbon'].includes(field) && !Number.isFinite(inputData[field])) {
      console.error(`[FERTILIZER SERVICE] Validation error: Invalid numeric field: ${field}`);
      throw new Error(`Invalid numeric field: ${field}`);
    }
    if (['Soil', 'Crop'].includes(field) && typeof inputData[field] !== 'string') {
      console.error(`[FERTILIZER SERVICE] Validation error: Invalid string field: ${field}`);
      throw new Error(`Invalid string field: ${field}`);
    }
  }

  const scriptPath = path.resolve(__dirname, '../../models/fertilizer recommendation system');
  console.log('[FERTILIZER SERVICE] Resolved script path:', scriptPath);

  const scriptFile = path.join(scriptPath, 'predict_fertilizer.py');
  if (!fs.existsSync(scriptFile)) {
    console.error(`[FERTILIZER SERVICE] Script file not found: ${scriptFile}`);
    throw new Error(`Python script not found at: ${scriptFile}`);
  }
  console.log('[FERTILIZER SERVICE] Script file exists:', scriptFile);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: 'C:\\Users\\Tauseef Ahmad Ghug\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
    scriptPath,
    args: [JSON.stringify(inputData)],
    timeout: 10000
  };

  console.log('[FERTILIZER SERVICE] PythonShell options:', JSON.stringify(options, null, 2));

  return new Promise((resolve, reject) => {
    const shell = new PythonShell('predict_fertilizer.py', options);

    let output = '';
    shell.on('message', (message) => {
      console.log('[FERTILIZER SERVICE] Python output:', message);
      output += message + '\n';
    });

    shell.on('stderr', (stderr) => {
      console.error('[FERTILIZER SERVICE] Python stderr:', stderr);
    });

    shell.on('close', (code) => {
      console.log('[FERTILIZER SERVICE] PythonShell closed with code:', code);
      try {
        if (!output.trim()) {
          return reject(new Error('No output received from Python script'));
        }
        const result = JSON.parse(output.trim());
        if (result.status === 'error') {
          console.error(`[FERTILIZER SERVICE] Prediction error: ${result.message}`);
          return reject(new Error(result.message));
        }
        console.log('[FERTILIZER SERVICE] Prediction successful:', result);
        resolve(result);
      } catch (parseErr) {
        console.error(`[FERTILIZER SERVICE] Parse error: ${parseErr.message}`);
        reject(new Error(`Failed to parse prediction result: ${parseErr.message}`));
      }
    });

    shell.on('error', (error) => {
      console.error(`[FERTILIZER SERVICE] PythonShell error: ${error.message}`);
      reject(new Error(`PythonShell error: ${error.message}`));
    });
  });
};

module.exports = { predictFertilizer };