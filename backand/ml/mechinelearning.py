import pandas as pd
import json
from datetime import datetime

# Load dataset
def load_data(file_path):
    df = pd.read_csv(file_path)
    return df

# Melakukan analisis dan menghasilkan rekomendasi
def get_recommendations(df, genre, min_rating, min_age):
    # Convert 'IMDb rating' and 'Age of viewers' columns to numeric, forcing errors to NaN
    df['IMDb rating'] = pd.to_numeric(df['IMDb rating'], errors='coerce')
    df['Age of viewers'] = pd.to_numeric(df['Age of viewers'], errors='coerce')

    # Log the types of columns to check for any issues
    print("IMDb rating type:", df['IMDb rating'].dtype)
    print("Age of viewers type:", df['Age of viewers'].dtype)

    # Log the first few rows to make sure data looks correct
    print("First few rows of the dataset:\n", df.head())

    # Filter data berdasarkan genre, rating, dan usia penonton
    filtered_shows = df[
        (df['Genre'].str.contains(genre, case=False, na=False)) & 
        (df['IMDb rating'] >= min_rating) & 
        (df['Age of viewers'] >= min_age)
    ]
    
    # Log the filtered data to check if any rows match the criteria
    print(f"Filtered shows ({len(filtered_shows)} records found):\n", filtered_shows)

    # If no records were found, inform the user
    if filtered_shows.empty:
        print(f"No shows found for genre '{genre}' with rating >= {min_rating} and age >= {min_age}")
        return None
    
    # Mengembalikan rekomendasi dalam format list of dict
    recommendations = filtered_shows[['Name of the show', 'IMDb rating']].to_dict(orient='records')
    
    # Menyimpan hasil rekomendasi ke file JSON
    result_filename = f"recommendations_{genre}_{min_rating}_{min_age}.json"
    with open(result_filename, 'w') as file:
        json.dump(recommendations, file)
    
    return result_filename



