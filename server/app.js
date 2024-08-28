// server/app.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'sql10.freesqldatabase.com',
    user: 'sql10728226',
    password: 'YJACstyghB',
    database: 'sql10728226',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Ruta para obtener estadísticas
app.get('/stats', (req, res) => {
    const query = 'SELECT * FROM statistics ORDER BY id DESC LIMIT 1';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para actualizar estadísticas
app.post('/stats', (req, res) => {
    const { visitCount, deckCount, averageTime } = req.body;
    const query = 'INSERT INTO statistics (visitCount, deckCount, averageTime, lastUpdated) VALUES (?, ?, ?, NOW())';
    db.query(query, [visitCount, deckCount, averageTime], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});