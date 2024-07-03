const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const login = require('../routes/login');
const db = require('../server/database');

// Route zur Points-Seite
router.get('/', (req, res, next) => {
    //Pfad zur HTML-Datei auf dem Server
    const filePath = path.join(__dirname, '..', 'pages','points.html');
    //Sende die HTML-Datei als Antwort
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).send('Internal Server Error'); //Falls ein Fehler auftritt
      }
    });
  });

  
  
// API-Route zum Abrufen der Benutzerpunkte
router.get('/api/user-scores', (req, res) => {
  db.all('SELECT id, name, data FROM users', [], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }

      const users = rows.map(row => {
          const userData = JSON.parse(row.data);
          return {
              id: row.id,
              name: row.name,
              score: userData.score || 0
          };
      });

      users.sort((a, b) => b.score - a.score); // Sortieren nach Punkten absteigend

      res.json(users);
  });
});

  module.exports = router;