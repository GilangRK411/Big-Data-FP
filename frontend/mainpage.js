document.getElementById('searchBtn').addEventListener('click', async function() {
    // Ambil nilai dari select box
    const genre = document.getElementById('genre').value;
    const age = document.getElementById('age').value;
    const rating = document.getElementById('rating').value;

    // Validasi input
    if (!genre || !age || !rating) {
        alert('Please select genre, age, and rating');
        return;
    }

    // Kirim request ke backend untuk mendapatkan rekomendasi
    const recommendations = await getRecommendations(genre, age, parseFloat(rating));
    
    // Tampilkan hasil rekomendasi ke UI
    displayRecommendations(recommendations);
});

// Fungsi untuk mengirim request ke backend
async function getRecommendations(genre, age, rating) {
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ genre, min_rating: rating, min_age: age })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        return data.recommendations;
    } catch (error) {
        console.error(error);
        alert('Error fetching recommendations: ' + error.message);
        return []; // Return empty recommendations in case of error
    }
}


// Fungsi untuk menampilkan hasil rekomendasi
function displayRecommendations(recommendations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Bersihkan hasil sebelumnya

    // Jika tidak ada rekomendasi
    if (recommendations.length === 0) {
        resultsDiv.innerHTML = '<p>No recommendations found.</p>';
        return;
    }

    // Tampilkan setiap rekomendasi
    recommendations.forEach((show) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = show.poster;  // Gunakan URL poster dari hasil rekomendasi
        img.alt = show.title;

        const title = document.createElement('h3');
        title.textContent = show.title;

        const genre = document.createElement('p');
        genre.textContent = `Genre: ${show.genre}`;

        const rating = document.createElement('p');
        rating.textContent = `Rating: ${show.rating}`;

        const button = document.createElement('button');
        button.textContent = 'Watch Now';

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(genre);
        card.appendChild(rating);
        card.appendChild(button);

        resultsDiv.appendChild(card);
    });
}
