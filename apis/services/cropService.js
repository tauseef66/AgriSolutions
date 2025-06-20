const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const predictCrop = async (inputData) => {
  console.log('[CROP SERVICE] Starting crop prediction at', new Date().toISOString());
  console.log('[CROP SERVICE] Input:', JSON.stringify(inputData, null, 2));
  
  const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
  
  for (const field of requiredFields) {
    if (!inputData[field] || typeof inputData[field] !== 'number') {
      console.error(`[CROP SERVICE] Validation error: Missing or invalid field: ${field}`);
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  const scriptPath = path.resolve(__dirname, '../../models/crop recommendation');
  console.log('[CROP SERVICE] Resolved script path:', scriptPath);

  const scriptFile = path.join(scriptPath, 'predict_crop.py');
  if (!fs.existsSync(scriptFile)) {
    console.error(`[CROP SERVICE] Script file not found: ${scriptFile}`);
    throw new Error(`Python script not found at: ${scriptFile}`);
  }
  console.log('[CROP SERVICE] Script file exists:', scriptFile);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: 'C:\\Users\\Tauseef Ahmad Ghug\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',
    scriptPath,
    args: [JSON.stringify(inputData)],
    timeout: 10000
  };

  console.log('[CROP SERVICE] PythonShell options:', JSON.stringify(options, null, 2));

  return new Promise((resolve, reject) => {
    const shell = new PythonShell('predict_crop.py', options);
    
    let output = '';
    shell.on('message', (message) => {
      console.log('[CROP SERVICE] Python output:', message);
      output += message + '\n';
    });

    shell.on('stderr', (stderr) => {
      console.error('[CROP SERVICE] Python stderr:', stderr);
    });

    shell.on('close', (code) => {
      console.log('[CROP SERVICE] PythonShell closed with code:', code);
      try {
        if (!output.trim()) {
          return reject(new Error('No output received from Python script'));
        }
        const result = JSON.parse(output.trim());
        if (result.status === 'error') {
          console.error(`[CROP SERVICE] Prediction error: ${result.message}`);
          return reject(new Error(result.message));
        }
        console.log('[CROP SERVICE] Prediction successful:', result);
        resolve(result);
      } catch (parseErr) {
        console.error(`[CROP SERVICE] Parse error: ${parseErr.message}`);
        reject(new Error(`Failed to parse prediction result: ${parseErr.message}`));
      }
    });

    shell.on('error', (error) => {
      console.error(`[CROP SERVICE] PythonShell error: ${error.message}`);
      reject(new Error(`PythonShell error: ${error.message}`));
    });
  });
};

module.exports = { predictCrop };