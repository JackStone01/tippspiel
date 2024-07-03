const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require("fs");
const md5 = require('md5'); // Passowrt Hashing
const sqlite3 = require('sqlite3').verbose();

const db = require('../server/database');

// Login.html anzeigen
router.get('/', function (req, res, next) {
    // Pfad zur HTML-Datei auf dem Server
    const filePath = path.join(__dirname, '..', 'pages', 'login.html');

    // Sende die HTML-Datei als Antwort
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(500).send('Internal Server Error'); // Falls ein Fehler auftritt
        }
    });
})


// Login (POST) 
router.post('/', (req, res) => {
    const { usr, pwd } = req.body;
    if (!usr || !pwd) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = md5(pwd);
    const query = 'SELECT * FROM users WHERE name = ?';

    db.get(query, [usr], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            const userData = JSON.parse(row.data);
            if (userData.password === hashedPassword) {
                req.session.user_id = row.id;
                req.session.user = usr;
                req.session.save();
                res.status(200).json({ message: 'Login erfolgreich' });
            } else {
                res.status(401).json({ error: 'Falsche Zugangsdaten' });
            }

        } else {
            res.status(401).json({ error: 'Falsche Zugangsdaten' });
        }
    });
});


module.exports = {router};