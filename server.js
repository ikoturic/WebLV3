const express = require('express');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Omogućavanje CORS-a (ako je potrebno za frontend)
app.use(cors());

// Poslužuje statičke datoteke iz mape 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta za dohvaćanje podataka iz CSV datoteke
app.get('/movies', (req, res) => {
    const results = [];
    
    // Put do CSV datoteke
    const csvFilePath = path.join(__dirname, 'public', 'movies.csv');
    
    // Čitanje i parsiranje CSV datoteke
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results); // Vraćamo podatke kao JSON
        })
        .on('error', (err) => {
            console.error('Error reading CSV:', err);
            res.status(500).json({ error: 'Unable to read the CSV file' });
        });
});

// Pokretanje servera
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
