from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    with open('bengaluru_house_model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define preprocessing function
def preprocess_input(data):
    # Convert data to DataFrame if it's a dictionary
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    else:
        df = pd.DataFrame(data)
    
    # Handle missing values
    df['bath'] = df['bath'].fillna(2)  # Median value assumption
    df['balcony'] = df['balcony'].fillna(1)  # Median value assumption
    df['bedrooms'] = df['bedrooms'].fillna(2)  # Median value assumption
    df['society'] = df['society'].fillna('Unknown')
    
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
    
    df['total_sqft'] = df['total_sqft'].apply(convert_sqft_to_num)
    
    # Return preprocessed data
    return df

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        # Get input data from the request
        data = request.get_json()
        
        # Preprocess the input data
        processed_data = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(processed_data)
        
        # Return the prediction
        return jsonify({
            'prediction': float(prediction[0]),
            'prediction_in_lakhs': float(prediction[0]),
            'prediction_in_rupees': float(prediction[0] * 100000)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/locations', methods=['GET'])
def get_locations():
    # This would return the list of locations from your dataset
    # For demo, we'll return a sample list
    locations = [
        "1st Block Jayanagar",
        "1st Phase JP Nagar",
        "2nd Phase Judicial Layout",
        "5th Block HRBR Layout",
        "5th Phase JP Nagar",
        "6th Phase JP Nagar",
        "7th Phase JP Nagar",
        "8th Phase JP Nagar",
        "9th Phase JP Nagar",
        "AECS Layout",
        "Abbigere",
        "Banashankari",
        "Bannerghatta Road",
        "Basavangudi",
        "Bommanahalli",
        "Brookefield",
        "Electronic City",
        "Hebbal",
        "Indira Nagar",
        "Jakkur",
        "Jayanagar",
        "JP Nagar",
        "Koramangala",
        "Marathahalli",
        "Sarjapur Road",
        "Whitefield",
        "Other"
    ]
    return jsonify(locations)

@app.route('/api/area_types', methods=['GET'])
def get_area_types():
    # Return the possible area types
    area_types = [
        "Super built-up Area",
        "Built-up Area",
        "Carpet Area",
        "Plot Area"
    ]
    return jsonify(area_types)

if __name__ == '__main__':
    app.run(debug=True)