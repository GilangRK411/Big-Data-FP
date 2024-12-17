async function requestRecommendations(genre, rating, age) {
    const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ genre, min_rating: rating, min_age: age })
    });

    const data = await response.json();
    return data.recommendations;
}
