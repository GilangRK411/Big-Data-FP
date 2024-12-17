from flask import Flask, request, jsonify
from pydantic import BaseModel
import mechinelearning as ml
import os

app = Flask(__name__)

# Model untuk request dari frontend
class RecommendationRequest(BaseModel):
    genre: str
    min_rating: float
    min_age: int

# Lokasi file CSV
DATA_PATH = os.path.join(os.getcwd(), 'filtered_shows.csv')


@app.route("/recommend", methods=["POST"])
def recommend():
    # Ambil data dari request
    data = request.get_json()
    recommendation_request = RecommendationRequest(**data)
    
    genre = recommendation_request.genre
    min_rating = recommendation_request.min_rating
    min_age = recommendation_request.min_age
    
    # Load data dan proses rekomendasi
    df = ml.load_data(DATA_PATH)
    result_filename = ml.get_recommendations(df, genre, min_rating, min_age)
    
    # Kirimkan nama file hasil rekomendasi ke frontend
    return jsonify({"result_file": result_filename})

if __name__ == "__main__":
    app.run(debug=True)
