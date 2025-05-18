# AgriSolutions ML Service

This service provides machine learning predictions for the AgriSolutions platform. It serves three main endpoints:
1. Crop Recommendation
2. Crop Yield Prediction
3. Fertilizer Recommendation

## Setup

1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the service:
```bash
python app.py
```

The service will run on port 5001 by default.

## API Endpoints

### 1. Crop Recommendation
**Endpoint:** `/predict/crop`
**Method:** POST
**Body:**
```json
{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.93
}
```

### 2. Crop Yield Prediction
**Endpoint:** `/predict/yield`
**Method:** POST
**Body:**
```json
{
    "crop": "rice",
    "area": 100,
    "rainfall": 200,
    "temperature": 25,
    "soil_type": "clay"
}
```

### 3. Fertilizer Recommendation
**Endpoint:** `/predict/fertilizer`
**Method:** POST
**Body:**
```json
{
    "crop": "rice",
    "temperature": 25,
    "humidity": 80,
    "moisture": 40,
    "soil_type": "clay",
    "nitrogen": 40,
    "potassium": 30,
    "phosphorous": 35
}
```

## Environment Variables

- `PORT`: Port number for the service (default: 5001)

## Error Handling

All endpoints return a JSON response with the following structure:
- Success: `{ "success": true, "prediction": "..." }`
- Error: `{ "success": false, "error": "..." }` 