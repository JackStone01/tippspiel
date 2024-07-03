//Node js Server

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const https = require('https');
const http = require('http');
const fs = require('fs');

const {router: login} = require('../routes/login');
const api = require('../routes/api');
const home = require('../routes/home');
const management = require('../routes/management');
const points = require('../routes/points');
const results = require ('../routes/results');
const rewards = require ('../routes/rewards');
const db = require('../server/database');
const { log } = require('console');

const app = express(); // Express App erstellen

// SSL Certificate an key files

const credentials = {
	key: fs.readFileSync('/etc/letsencrypt/live/testinglab.digital/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/testinglab.digital/fullchain.pem'),
};

// Für Live Umgebung nicht benötigt, nur für localhost
//const hostname = '127.0.0.1'; 
const port = 80; //Port vom Server


// CSS und Javascript Dateien für HTML-Dateien verfügbar machen

app.use(express.static(path.join(__dirname,'..')));


//Middleware
app.use(bodyParser.json());

//Session Middleware
app.use(session({
  store: new SQLiteStore({db:'sessions.db'}),
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10 * 60 * 1000, secure: false} // Cookie max Age 1 min.
}));


app.post('/update-database', (req, res) => {
    database.updateGamesWithScores();
    res.send('Database update triggered successfully.');
});

//Check if user is authenticated
function isAuthenticated(req, res, next) {
  if(req.session.user) {
    return next();
  } else {
    console.log('User not authenticated, redirecting to login');
    return res.redirect('/login');
  }
}


function getUserRole(userId, callback) {
  db.get('SELECT data FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error fetching user role:', err);
      return callback(err);
    }

    if (row) {
      const userData = JSON.parse(row.data);
      return callback(null, userData.role);
    } else {
      return callback(new Error('User not found'));
    }
  });
}


function isAdmin(req, res, next) {
  if (!req.session.user_id) {
    console.log('User not authenticated, redirecting to login');
    return res.redirect('/login');
  }

  getUserRole(req.session.user_id, (err, role) => {
    if (err) {
      console.error('Error checking user role:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (role === 'admin') {
      return next();
    } else {
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.status(403).json({ message: 'Access denied' });
      } else {
        return res.redirect('/');
      }
    }
  });
}





// Route zum Zurücksetzen der Session
app.get('/reset-session', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not reset session');
    }
    res.redirect('/login');
  });
});

// Route zum Abrufen des aktuell eingeloggten Benutzers
app.get('/api/current_user', (req, res) => {
  if (req.session && req.session.user_id) {
      res.json({ user_id: req.session.user_id });
  } else {
      res.status(401).json({ message: 'Nicht eingeloggt' });
  }
});

app.use('/login', login);
app.use('/api/users', isAuthenticated, api);
app.use('/management', isAuthenticated, isAdmin, management);
app.use('/points', isAuthenticated, points);
app.use('/results', isAuthenticated, results);
app.use('/rewards', isAuthenticated, rewards);
app.use('/', isAuthenticated, home);

// 404 - Not Found
app.use(function (req, res) {
  res.status(404).send('Not Found');
});


// Server starten localhost
//app.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/login`);
//});

// Live Umbebung Server starten
const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});



module.exports.isAuthenticated = isAuthenticated;
