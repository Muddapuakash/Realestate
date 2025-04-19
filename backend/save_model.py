# This script extracts and saves the best model from your notebook
# Run this after you've completed the model training in your notebook

import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBRegressor

def preprocess_data(df):
    # Your preprocessing function (same as in the notebook)
    df_copy = df.copy()
    
    # Extract number of bedrooms from 'size'
    df_copy['bedrooms'] = df_copy['size'].str.extract('(\\d+)').astype(float)
    
    # Handle missing values
    df_copy['bath'] = df_copy['bath'].fillna(df_copy['bath'].median())
    df_copy['balcony'] = df_copy['balcony'].fillna(df_copy['balcony'].median())
    df_copy['bedrooms'] = df_copy['bedrooms'].fillna(df_copy['bedrooms'].median())
    df_copy['society'] = df_copy['society'].fillna('Unknown')
    
    # Group infrequent locations
    location_counts = df_copy['location'].value_counts()
    locations_less_than_10 = location_counts[location_counts < 10].index
    df_copy.loc[df_copy['location'].isin(locations_less_than_10), 'location'] = 'Other'
    
    # Convert total_sqft to numeric
    def convert_sqft_to_num(x):
        if isinstance(x, str) and '-' in x:
            vals = x.split('-')
            try:
                return (float(vals[0]) + float(vals[1])) / 2
            except:
                return np.nan
        try:
            return float(x)
        except:
            return np.nan
    
    df_copy['total_sqft'] = df_copy['total_sqft'].apply(convert_sqft_to_num)
    
    # Drop unnecessary columns and null values
    df_copy = df_copy.drop('size', axis=1)
    df_copy = df_copy.dropna(subset=['total_sqft'])
    
    return df_copy

def create_and_save_model():
    try:
        # Load the dataset
        df = pd.read_csv('Bengaluru_House_Data.csv')
        print("Dataset loaded successfully!")
        
        # Preprocess the data
        df_cleaned = preprocess_data(df)
        print("Data preprocessing completed!")
        
        # Separate features and target
        X = df_cleaned.drop('price', axis=1)
        y = df_cleaned['price']
        
        # Identify categorical and numerical features
        categorical_features = ['area_type', 'location', 'society']
        numerical_features = ['total_sqft', 'bath', 'balcony', 'bedrooms']
        
        # Create preprocessing pipelines
        numerical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])
        
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numerical_transformer, numerical_features),
                ('cat', categorical_transformer, categorical_features)
            ])
        
        # Save the preprocessor
        with open('preprocessor.pkl', 'wb') as file:
            pickle.dump(preprocessor, file)
        print("Preprocessor saved successfully!")
        
        # Create and fit the best model (XGBoost)
        xgb_model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
        
        # Create the pipeline
        model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('model', xgb_model)
        ])
        
        # Train the model
        print("Training the model...")
        model.fit(X, y)
        print("Model trained successfully!")
        
        # Save the model
        with open('model.pkl', 'wb') as file:
            pickle.dump(model, file)
        print("Model saved successfully as 'model.pkl'!")
        
        return True
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return False

if __name__ == "__main__":
    success = create_and_save_model()
    if success:
        print("Model preparation completed successfully.")
    else:
        print("Failed to prepare the model.")