const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const login = require('../routes/login');
const db = require('../server/database');

// Route zur Results-Seite
router.get('/', (req, res, next) => {
    //Pfad zur HTML-Datei auf dem Server
    const filePath = path.join(__dirname, '..', 'pages','results.html');
    //Sende die HTML-Datei als Antwort
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).send('Internal Server Error'); //Falls ein Fehler auftritt
      }
    });
  });

  module.exports = router;