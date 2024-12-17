const express = require('express');
const path = require('path');
const fetch = require('node-fetch');  // Using node-fetch version 2.x
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, '../../frontend')));  // Folder Frontend sebagai static file

// Rute untuk melayani mainpage.html ketika mengakses root ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/', 'mainpage.html'));
});
// Menyajikan folder Frontend

app.post('/api/recommend', async (req, res) => {
    const { genre, min_rating, min_age } = req.body;  // Now req.body should be properly parsed

    if (!genre || !min_rating || !min_age) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await fetch('http://localhost:5000/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ genre, min_rating, min_age })
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Error fetching recommendations from ML server' });
        }

        const data = await response.json();
        const resultFile = data.result_file;

        fs.readFile(path.join(__dirname, '../ml', resultFile), 'utf8', (err, fileData) => {
            if (err) {
                return res.status(500).json({ error: 'Error reading recommendation file' });
            }

            const recommendations = JSON.parse(fileData);
            res.json({ recommendations });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from ML service' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`);
});
