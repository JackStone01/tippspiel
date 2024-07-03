const express = require('express');
const router = express.Router();
const md5 = require('md5'); // Passowrt Hashing
const sqlite3 = require('sqlite3').verbose();

const db = require('../server/database');

// let db = new sqlite3.Database('./users.db', (err) => {
//     if(err) {
//       console.error('Could not connect to database', err);
//     }else {
//       console.log('Connected to SQLite database');
//     }
//   })

// API zur Abfrage aller Benutzer
router.get('/', (req, res, next) => {
    const query = 'SELECT * FROM users';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// API zur Abfrage eines bestimmten Benutzers anhand seiner ID
router.get('/:id', (req, res, next) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});



// API zur Löschung eines Benutzers
router.delete('/:name', (req, res, next) => {
     const name = req.params.name;
    console.log('Deleting user with name:', name); // Check if name is correctly received

    const query = 'DELETE FROM users WHERE name = ?';

    db.run(query, [name], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            console.log(`No user found with name '${name}'.`);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`User '${name}' deleted successfully.`);
        res.json({ message: 'User deleted successfully' });
    });
});

//API zur Erstellung eines Nutzers
router.post('/create', (req, res, next) => {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
        return res.status(400).json({ message: 'Bitte alle Felder ausfüllen' });
    }

    const checkQuery = 'SELECT * FROM users WHERE name = ?';
    db.get(checkQuery, [name], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Fehler beim Überprüfen des Benutzernamens' });
        }
        if (row) {
            return res.status(400).json({ message: 'Benutzername ist bereits vergeben' });
        }

        const hashedPassword = md5(password);
        const userData = JSON.stringify({ password: hashedPassword, score: 0, role });

        const insertQuery = `INSERT INTO users (name, data) VALUES (?, ?)`;
        db.run(insertQuery, [name, userData], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers' });
            }
            res.status(201).json({ message: 'Benutzer erfolgreich erstellt' });
        });
    });
});





module.exports = router;