const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const md5 = require('md5'); // To create a hash value for stored passwords
const express = require('express');
const app = express();

const DBSOURCE = "users.db";
//Initialisierung der Datenbank
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {

        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        db.serialize(() => {

             //Erstellt die UserDB
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                data TEXT
            )`);

            const adminName = 'admin';
            const adminRole = 'admin';
            const hashedPassword = md5('EMtippSpiel2024!');
            const adminData = {
                password: hashedPassword,
                score: 0,
                role: adminRole
            };
            //erstellt Admin falls dieser noch nicht existiert
            const insertAdminQuery = `
                INSERT INTO users (name, data)
                SELECT ?, ?
                WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = ?)
            `;

            db.run(insertAdminQuery, [adminName, JSON.stringify(adminData), adminName], (err) => {
                if (err) {
                    console.error('Error creating admin:', err);
                } else {
                    console.log('Administrator "admin" wurde erfolgreich erstellt oder existiert bereits.');
                }
            });

            //Erstellt Games DB
            db.run(`CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team1 TEXT NOT NULL,
                team2 TEXT NOT NULL,
                team1_goals INTEGER DEFAULT 0,
                team2_goals INTEGER DEFAULT 0,
                time TEXT NOT NULL,
                date TEXT NOT NULL,
                group_name TEXT,
                ScoresForGameUpdated BOOLEAN DEFAULT 0,
                matchIsFinished BOOLEAN DEFAULT 0
            )`, (err) => {
                if (err) {
                    console.error("Error creating games table: ", err.message);
                } else {

                    db.get('SELECT COUNT(*) AS count FROM games', (err, row) => {
                        if (err) {
                            console.error('Error checking games:', err.message);
                            return;
                        }

                        //Funktionsaufruf zum erstellen der Spiele und der Spiele die erst im Verlauf der Em erstellt werden können
                        if (row.count === 0) {
                            fetchAndInsertGames();
                            fetchAndInsertNewGames();
                        } else {
                            //Falls Datenbank schon elemente hat ruft trotzdem Funktion für die späteren Spiele auf

                            console.log('Games already exist in the database. Checking for new games...');
                            fetchAndInsertNewGames();
                        }
                    });

                   //Regelmäßiges Aufrufen der Spieler Punkte, Spiel Ergebnisse und neuer Spiel erstellungs Funktionen
                    setInterval(updateScores,  10*60*1000);
                    setInterval(updateGamesWithScores,    10*60*1000);
                    setInterval(fetchAndInsertNewGames, 10*60*1000);// Every 10 minutes

                }
            });

            //Erstellt TippsDB
            db.run(`CREATE TABLE IF NOT EXISTS tipps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                game_id INTEGER,
                team1_score INTEGER,
                team2_score INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(game_id) REFERENCES games(id)
            )`);

            //Erstellt PreiseDB
            db.run(`CREATE TABLE IF NOT EXISTS preise (
                place INTEGER PRIMARY KEY,
                description TEXT NOT NULL
            )`);
        });
    }
});

app.use(express.json());

//funktion zum Games ziehen aus der OpenLIgaDB bei erstem Serverstart
async function fetchAndInsertGames() {
    let groupId = 1;
    let maxGroupId = 20;

    //Deklaration der ApiURL der OpenLigadb die GroupID dient die mehrern Teile der Api durchzuchecken
    while (groupId <= maxGroupId) {
        const apiURL = `https://api.openligadb.de/getmatchdata/em2024/2024/${groupId}`;

        try {
            const response = await axios.get(apiURL);

            if (response.data.length === 0) {
                break;
            }

            const games = response.data;
            const insertStmt = db.prepare(`INSERT INTO games (team1, team2, team1_goals, team2_goals, time, date, group_name, matchIsFinished) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);


            games.forEach((game) => {
                const team1 = game.team1.teamName;
                const team2 = game.team2.teamName;
                const team1_goals = game.matchResults[0]?.pointsTeam1 || 0;
                const team2_goals = game.matchResults[0]?.pointsTeam2 || 0;
                const time = new Date(game.matchDateTimeUTC).toISOString().split('T')[1];
                const date = new Date(game.matchDateTimeUTC).toISOString().split('T')[0];
                const group_name = game.group?.groupName || '';
                const matchIsFinished = game.matchIsFinished || false;

                if (group_name.startsWith('Gruppe', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale')) {
                    insertStmt.run(team1, team2, team1_goals, team2_goals, time, date, group_name, matchIsFinished, (err) => {
                        if (err) {
                            console.error("Error inserting game data: ", err.message);
                        }
                    });
                }
            });

            groupId++;
            insertStmt.finalize();
        } catch (error) {
            console.error(`Error fetching data from API group ${groupId}: `, error.message);
            break;
        }
    }
}

//funktion zum Games ziehen aus der OpenLIgaDB für Achtelfinale/Viertelfinale/Halbfinale/Finale
async function fetchAndInsertNewGames() {
    let groupId = 1;
    const maxGroupId = 20;

    while (groupId <= maxGroupId) {
        const apiURL = `https://api.openligadb.de/getmatchdata/em2024/2024/${groupId}`;

        try {
            const response = await axios.get(apiURL);

            if (response.data.length === 0) {
                break;
            }

            const games = response.data;
            const insertStmt = db.prepare(`INSERT INTO games (team1, team2, team1_goals, team2_goals, time, date, group_name, matchIsFinished) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

            for (const game of games) {
                const team1 = game.team1.teamName;
                const team2 = game.team2.teamName;
                const team1_goals = game.matchResults[0]?.pointsTeam1 || 0;
                const team2_goals = game.matchResults[0]?.pointsTeam2 || 0;
                const time = new Date(game.matchDateTimeUTC).toISOString().split('T')[1];
                const date = new Date(game.matchDateTimeUTC).toISOString().split('T')[0];
                const group_name = game.group?.groupName || '';
                const matchIsFinished = game.matchIsFinished || false;

                if (!group_name.startsWith('Gruppe')) {
                    const rows = await new Promise((resolve, reject) => {
                        db.all(`SELECT team1, team2 FROM games`, [], (err, rows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                        });
                    });

                    const teamNames = rows.flatMap(row => [row.team1, row.team2]);

                    if (teamNames.includes(team1) && teamNames.includes(team2)) {
                        const row = await new Promise((resolve, reject) => {
                            db.get(`SELECT COUNT(*) as count FROM games WHERE (team1 = ? AND team2 = ? AND group_name = ?) OR (team1 = ? AND team2 = ? AND group_name = ?)`,
                                [team1, team2, group_name, team2, team1, group_name], (err, row) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(row);
                                }
                            });
                        });

                        if (row.count === 0) {
                            insertStmt.run(team1, team2, team1_goals, team2_goals, time, date, group_name, matchIsFinished, (err) => {
                                if (err) {
                                    console.error("Error inserting game data: ", err.message);
                                } else {
                                    console.log(`Spiel in ${group_name} mit ${team1} und ${team2} wurde eingefügt!`);
                                }
                            });
                        }
                    }
                }
            }

            insertStmt.finalize();
            groupId++;
        } catch (error) {
            console.error(`Error fetching data from API group ${groupId}: `, error.message);
            break;
        }
    }
}

//Funktion zum Updaten von Spielen die bereits angefangen haben
async function updateGamesWithScores() {
    console.log('Updated Game Scores!');
    let groupId = 1;
    const maxGroupId = 20;

    while (groupId <= maxGroupId) {
        const apiURL = `https://api.openligadb.de/getmatchdata/em2024/2024/${groupId}`;

        try {
            const response = await axios.get(apiURL);

            if (response.data.length === 0) {
                break; // Keine Spiele mehr für diese Gruppe
            }

            const games = response.data;

            const updateStmt = db.prepare(`
                UPDATE games 
                SET team1_goals = ?, team2_goals = ?
                WHERE team1 = ? AND team2 = ? AND date = ?
            `);

            games.forEach((game) => {
                const team1 = game.team1.teamName;
                const team2 = game.team2.teamName;
                const team1_goals = game.matchResults[0]?.pointsTeam1 || 0;
                const team2_goals = game.matchResults[0]?.pointsTeam2 || 0;
                const date = new Date(game.matchDateTimeUTC).toISOString().split('T')[0];

                const gameDateTime = new Date(game.matchDateTimeUTC);
                const now = new Date();

                // Vergleiche das Spielzeitpunkt mit der aktuellen Zeit
                if (gameDateTime <= now) {
                    updateStmt.run(team1_goals, team2_goals, team1, team2, date, (err) => {
                        if (err) {
                            console.error("Error updating game data: ", err.message);
                        } else {
                            console.log(`Spiel ${team1} vs ${team2} am ${date} wurde erfolgreich geupdated!`);
                        }
                    });
                }
            });

            updateStmt.finalize();

            groupId++;
        } catch (error) {
            console.error(`Error fetching data from API group ${groupId}: `, error.message);
            break;
        }
    }
}

//Funktion zum updaten der UserScores sobald das Match finished ist
async function updateScores() {
    console.log('Updated User Scores!');
// durchsucht Games DB nach spielen die abgeschlossen sind aber noch nicht Ausgewertet wurden
    const query = `
        SELECT g.id, g.team1_goals, g.team2_goals, t.user_id, t.team1_score, t.team2_score, u.data AS user_data
        FROM games AS g
        INNER JOIN tipps AS t ON g.id = t.game_id
        INNER JOIN users AS u ON t.user_id = u.id
        WHERE g.matchIsFinished = 1  
          AND g.ScoresForGameUpdated = 0
    `;

    db.all(query, async (err, rows) => {
        if (err) {
            console.error('Error querying games:', err.message);
            return;
        }

        // Iterate durch alle Games
        for (const row of rows) {
            const {
                id: gameId,
                team1_goals: actualTeam1Goals,
                team2_goals: actualTeam2Goals,
                user_id: userId,
                team1_score: guessedTeam1Score,
                team2_score: guessedTeam2Score,
                user_data
            } = row;
            const userData = JSON.parse(user_data);

            let points = 0;

            if (guessedTeam1Score === actualTeam1Goals && guessedTeam2Score === actualTeam2Goals) {
                points = 3;
            } else if ((actualTeam1Goals > actualTeam2Goals && guessedTeam1Score > guessedTeam2Score) ||
                (actualTeam1Goals < actualTeam2Goals && guessedTeam1Score < guessedTeam2Score) ||
                (actualTeam1Goals === actualTeam2Goals && guessedTeam1Score === guessedTeam2Score)) {
                points = 1;
            }

            try {
                // Current Userdata
                const userDataFromDb = await new Promise((resolve, reject) => {
                    db.get(`SELECT data
                            FROM users
                            WHERE id = ?`, [userId], (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    });
                });

                if (userDataFromDb) {
                    const user = JSON.parse(userDataFromDb.data);
                    user.score = (user.score || 0) + points;

                    // User scores updaten
                    await new Promise((resolve, reject) => {
                        db.run(`UPDATE users
                                SET data = ?
                                WHERE id = ?`, [JSON.stringify(user), userId], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(`User ${userId} bekommt ${points} Punkte. Neuer Score: ${user.score}`);
                                resolve();
                            }
                        });
                    });

                    // Spiel als ausgewertet markieren
                    await new Promise((resolve, reject) => {
                        db.run(`UPDATE games
                                SET ScoresForGameUpdated = 1
                                WHERE id = ?`, [gameId], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(`Scores updated für Spiel mit ID: ${gameId}.`);
                                resolve();
                            }
                        });
                    });
                } else {
                    console.error(`User ${userId} not found in the database.`);
                }
            } catch (error) {
                console.error(`Error updating scores for game ${gameId} and user ${userId}:`, error.message);
            }
        }
    });
}

function startUpdateCycle() {
    // Funktionen beim Start aufrufen
    updateGamesWithScores();
    updateScores();

    // Funktionen alle 30 Sekunden aufrufen
    setInterval(() => {
        updateGamesWithScores();
        updateScores();
    }, 60000); // 30 Sekunden in Millisekunden
}

// Starte den Aktualisierungszyklus
startUpdateCycle();

module.exports = db;