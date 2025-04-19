import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import pickle

def preprocess_data(df):
    df_copy = df.copy()
    
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
    
    # Extract number of bedrooms from 'size'
    df_copy['bedrooms'] = df_copy['size'].str.extract('(\\d+)').astype(float)
    
    # Drop rows with null prices
    df_copy = df_copy.dropna(subset=['price'])
    
    # Group infrequent locations
    location_counts = df_copy['location'].value_counts()
    locations_less_than_10 = location_counts[location_counts < 10].index
    df_copy.loc[df_copy['location'].isin(locations_less_than_10), 'location'] = 'Other'
    
    # Fill missing values
    df_copy['bath'] = df_copy['bath'].fillna(df_copy['bath'].median())
    df_copy['balcony'] = df_copy['balcony'].fillna(df_copy['balcony'].median())
    df_copy['bedrooms'] = df_copy['bedrooms'].fillna(df_copy['bedrooms'].median())
    df_copy['society'] = df_copy['society'].fillna('Unknown')
    
    # Drop rows with missing total_sqft
    df_copy = df_copy.dropna(subset=['total_sqft'])
    
    # Calculate price per square foot
    df_copy['price_per_sqft'] = df_copy['price'] * 100000 / df_copy['total_sqft']
    
    # Remove outliers
    def remove_pps_outliers(df):
        df_out = pd.DataFrame()
        for key, subdf in df.groupby('location'):
            m = np.mean(subdf['price_per_sqft'])
            sd = np.std(subdf['price_per_sqft'])
            reduced_df = subdf[(subdf['price_per_sqft'] > (m - 2 * sd)) & 
                              (subdf['price_per_sqft'] < (m + 2 * sd))]
            df_out = pd.concat([df_out, reduced_df], ignore_index=True)
        return df_out
    
    def remove_bhk_outliers(df):
        exclude_indices = np.array([])
        for location, location_df in df.groupby('location'):
            bhk_stats = {}
            for bhk, bhk_df in location_df.groupby('bedrooms'):
                bhk_stats[bhk] = {
                    'mean': np.mean(bhk_df['price_per_sqft']),
                    'std': np.std(bhk_df['price_per_sqft']),
                    'count': bhk_df.shape[0]
                }
            for bhk, bhk_df in location_df.groupby('bedrooms'):
                if bhk > 1:
                    if bhk_stats[bhk]['count'] > 5:
                        stats = bhk_stats.get(bhk-1)
                        if stats and stats['count'] > 5:
                            if bhk_stats[bhk]['mean'] < stats['mean']:
                                exclude_indices = np.append(exclude_indices, bhk_df[bhk_df['price_per_sqft'] < stats['mean']].index.values)
        return df.drop(exclude_indices)
    
    df_copy = remove_pps_outliers(df_copy)
    df_copy = remove_bhk_outliers(df_copy)
    
    # Drop unnecessary columns
    columns_to_drop = ['size', 'price_per_sqft']
    df_copy = df_copy.drop(columns=columns_to_drop, errors='ignore')
    
    return df_copy

def main():
    # Load the dataset
    print("Loading dataset...")
    df = pd.read_csv('Bengaluru_House_Data.csv')
    
    # Preprocess data
    print("Preprocessing data...")
    df_cleaned = preprocess_data(df)
    
    # Separate features and target
    X = df_cleaned.drop('price', axis=1)
    y = df_cleaned['price']
    
    # Identify categorical and numerical features
    categorical_features = ['area_type', 'location', 'society']
    numerical_features = ['total_sqft', 'bath', 'balcony', 'bedrooms']
    
    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
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
    
    # Create and train the model pipeline
    # Using XGBoost as it typically performs well for these types of problems
    print("Training XGBoost model...")
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42))
    ])
    
    model_pipeline.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model_pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Evaluation:")
    print(f"Mean Absolute Error: {mae:.2f} lakhs")
    print(f"Root Mean Squared Error: {rmse:.2f} lakhs")
    print(f"R² Score: {r2:.4f}")
    
    # Save the model
    print("Saving model...")
    with open('bengaluru_house_model.pkl', 'wb') as f:
        pickle.dump(model_pipeline, f)
    
    print("Model trained and saved successfully!")

if __name__ == "__main__":
    main()