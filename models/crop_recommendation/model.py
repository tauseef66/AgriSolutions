import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_model():
    # Load your dataset
    # Replace this with your actual dataset path
    try:
        df = pd.read_csv('crop_recommendation_data.csv')
        
        # Features and target
        X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
        y = df['label']  # crop type
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Save the model
        joblib.dump(model, 'model.joblib')
        print("Model trained and saved successfully!")
        
        # Print accuracy
        train_accuracy = model.score(X_train, y_train)
        test_accuracy = model.score(X_test, y_test)
        print(f"Training accuracy: {train_accuracy:.2f}")
        print(f"Testing accuracy: {test_accuracy:.2f}")
        
    except Exception as e:
        print(f"Error during training: {e}")

if __name__ == "__main__":
    train_model() 