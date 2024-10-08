require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
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