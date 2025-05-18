import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

def train_model():
    try:
        # Load your dataset
        # Replace this with your actual dataset path
        df = pd.read_csv('crop_yield_data.csv')
        
        # Features and target
        X = df[['area', 'item', 'year', 'rainfall', 'pesticides', 'temperature']]
        y = df['yield']
        
        # Handle categorical variables
        X = pd.get_dummies(X, columns=['item'])
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Save the model
        joblib.dump(model, 'model.joblib')
        print("Model trained and saved successfully!")
        
        # Print R2 score
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
        print(f"Training R2 score: {train_score:.2f}")
        print(f"Testing R2 score: {test_score:.2f}")
        
    except Exception as e:
        print(f"Error during training: {e}")

if __name__ == "__main__":
    train_model() 