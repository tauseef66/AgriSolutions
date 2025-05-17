import sys
import json
from model_interface import MLModels

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Invalid arguments"}))
        sys.exit(1)

    model_function = sys.argv[1]
    input_data = json.loads(sys.argv[2])

    try:
        ml_models = MLModels()
        
        if model_function == 'predict_crop_recommendation':
            result = ml_models.predict_crop_recommendation(input_data)
        elif model_function == 'predict_crop_yield':
            result = ml_models.predict_crop_yield(input_data)
        elif model_function == 'recommend_fertilizer':
            result = ml_models.recommend_fertilizer(input_data)
        else:
            print(json.dumps({"error": "Invalid model function"}))
            sys.exit(1)

        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main() 