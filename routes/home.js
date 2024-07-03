const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const login = require('../routes/login');
const db = require('../server/database');

// Route zur Home-Seite
router.get('/', (req, res, next) => {
    //Pfad zur HTML-Datei auf dem Server
    const filePath = path.join(__dirname, '..', 'pages','home.html');
    //Sende die HTML-Datei als Antwort
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).send('Internal Server Error'); //Falls ein Fehler auftritt
      }
    });
  });

//get Games endpoint
router.get('/api/games', (req, res, next) => {
    const query = 'SELECT * FROM games';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch games' });
        }
        res.json(rows);

    });
});

//get Tipps endpoint
router.get('/api/tipps', (req, res) => {
    const userId = req.query.user_id;

    const query = 'SELECT * FROM tipps WHERE user_id = ?';
    db.all(query, [userId], (err, tipps) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch tipps' });
        }
        res.json(tipps); // Sendet die Tipps als JSON-Antwort
    });
});

//check nach spezifischen Group_names
router.get('/api/games/:phaseName', (req, res, next) => {
    const { phaseName } = req.params;
    const query = 'SELECT * FROM games WHERE group_name = ?';
    db.all(query, [phaseName], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: `Failed to fetch ${phaseName} games` });
        }
        console.log(`Response JSON for ${phaseName}:`, rows);
        res.json(rows);
    });
});

//check ob user für Spiel schon getippt hat
router.get('/check-tip/:userId/:gameId', (req, res, next) => {
    const userId = req.params.userId;
    const gameId = req.params.gameId;


    const selectQuery = `
        SELECT 
            tipps.team1_score, 
            tipps.team2_score,
            games.team1 AS team1_name, 
            games.team2 AS team2_name
        FROM tipps
        JOIN games ON tipps.game_id = games.id
        WHERE tipps.user_id = ? AND tipps.game_id = ?
    `;

    db.get(selectQuery, [userId, gameId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch current tip' });
        }

        if (!row) {

            return res.json({ exists: false, oldTip: null });
        }


        const oldTip = {
            team1_score: row.team1_score,
            team2_score: row.team2_score,
            team1_name: row.team1_name,
            team2_name: row.team2_name
        };

        res.json({ exists: true, oldTip: oldTip });
    });
});

//API zum Löschen des alten Tipps falls dieser über die Confirm funktion überschrieben werden soll
router.delete('/delete-tip/:userId/:gameId', (req, res, next) => {
    const userId = req.params.userId;
    const gameId = req.params.gameId;


    const selectQuery = 'SELECT team1_score, team2_score FROM tipps WHERE user_id = ? AND game_id = ?';

    db.get(selectQuery, [userId, gameId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch current tip' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Tip not found' });
        }

        const oldTip = {
            team1_score: row.team1_score,
            team2_score: row.team2_score
        };


        const deleteQuery = 'DELETE FROM tipps WHERE user_id = ? AND game_id = ?';
        db.run(deleteQuery, [userId, gameId], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to delete tip' });
            }

            console.log(`Deleted tip for user ${userId} and game ${gameId}`);
            res.status(200).json({
                message: 'Tip deleted successfully',
                oldTip: oldTip
            });
        });
    });
});


//Api zum abspeichern eines Tipps
router.post('/save-tip', (req, res, next) => {
    const { user_id, game_id, team1_score, team2_score } = req.body;


    if (!user_id || !game_id || team1_score == null || team2_score == null) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO tipps (user_id, game_id, team1_score, team2_score) VALUES (?, ?, ?, ?)';
    db.run(query, [user_id, game_id, team1_score, team2_score], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save tip' });
        }
        res.json({ message: 'Tip saved successfully', id: this.lastID });
    });
});

// POST endpoint preise
router.post('/api/preise', (req, res) => {
    const { place, description } = req.body;
    const query = `
        INSERT INTO preise (place, description) VALUES (?, ?)
        ON CONFLICT(place) DO UPDATE SET description=excluded.description
    `;

    db.run(query, [place, description], function(err) {
        if (err) {
            console.error('Error setting prize:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Prize set successfully', id: this.lastID });
    });
});



// GET endpoint preise
router.get('/api/preise', (req, res) => {
    db.all(`SELECT * FROM preise ORDER BY place`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching prizes:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(rows); // Ensure rows is an array of objects with 'place' and 'description'
    });
});

  module.exports = router;
