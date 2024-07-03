const { response } = require('express');


//Prüft die eingegebenen Logindaten
function login() {
    //Speichere eingegebene Werte in den zwei Variablen
    usr = document.getElementById("usr").value;
    pwd = document.getElementById("pwd").value;
    //prüfen, ob alle Felder ausgefüllt sind
    if (usr == "" && pwd == "")
        window.alert("Fehler: Bitte Nutzername und Passwort eingeben!");
    else if (usr == "")
        window.alert("Fehler: Bitte Nutzername eingeben!");
    else if (pwd == "")
        window.alert("Fehler: Bitte Passwort eingeben!");
    else if (usr != "" && pwd != "")
        // Send a POST request to the server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usr: usr, pwd: pwd })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    window.alert(data.error);
                } else {
                    //Redirect zur Home-Seite nach erfolgreichem Login
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
}


//Löst bei Enter drücken die login Funktion aus 
document.getElementById("pwd").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        login()
    }
});
document.getElementById("usr").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });


async function getCurrentUserId() {
    try {
        const response = await fetch('/api/current_user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        });
        const data = await response.json();
        if (data.user_id) {
            return data.user_id;
        } else {
            throw new Error('Benutzer nicht eingeloggt');
        }
    } catch (error) {
        console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
        return null;
    }
}



//Funktion zum abspeichern von Tipps
async function saveguess(gameId) {
    //Tipp Abgabe aus Html ziehen

    const guessteam1 = document.getElementById('guessteam1').value;
    const guessteam2 = document.getElementById('guessteam2').value;

    // Alert wenn für ein Team kein Score getippt wurde
    if (guessteam1 === "" || guessteam2 === "") {
        window.alert("Bitte alle Felder ausfüllen");
        return;
    }

    //Check ob die Abgabe eine Zahl oder 0 ist
    const checkvar1 = isNaturalNumberOrZero(guessteam1);
    const checkvar2 = isNaturalNumberOrZero(guessteam2);

    //Alert falls nicht Zahl oder 0
    if (checkvar1 === false || checkvar2 === false) {
        window.alert("Bitte einen gültigen Wert eintragen");
        return;
    }

    // Error falls GameId nicht richtig üergeben wird
    if (!gameId) {
        console.error('Game ID is null');
        window.alert('Fehler beim Abrufen der Spiel-ID');
        return;
    }

    // Aufruf der getCurrentUserID function um die UserId des eingeloggten Users zu erhalten
    const userId = await getCurrentUserId();

    //Alert falls keine UserId erhalten wird
    if (!userId) {
        window.alert('Fehler beim Abrufen der Benutzer-ID');
        return;
    }

    //Zusammenfassung des Tipps in tipData
    const team1Score = parseInt(guessteam1);
    const team2Score = parseInt(guessteam2);

    const tipData = {
        user_id: userId, 
        game_id: gameId,
        team1_score: team1Score,
        team2_score: team2Score,
    };

    // Check ob für den user und das game ein tip existiert
    fetch(`/check-tip/${tipData.user_id}/${gameId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            // Dialog feld zum entscheiden ob tipp überschrieben werden soll oder nicht
            const oldTip = `Alter Tipp: ${data.oldTip.team1_name} - (${data.oldTip.team1_score}) --- ${data.oldTip.team2_name} (${data.oldTip.team2_score})\n\nMöchten Sie diesen Tipp überschreiben?`;
            const confirmOverride = confirm(oldTip);

            if (confirmOverride) {
                // Löscht alten TIpp und speichert neuen über FUnktion
                deleteAndSaveTip(tipData);
            }
        } else {
            // Speichert Tipp wenn es noch keinen Tipp gibt
            fetch('/save-tip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tipData)
            })
            .then(response => response.json())
            .then(data => {
                window.alert(data.message);
            })
                //Error catches
            .catch(error => {
                console.error('Error saving tip:', error);
                window.alert('Fehler beim Speichern des Tipps');
            });
        }
    })
    .catch(error => {
        console.error('Error checking tip:', error);
        window.alert('Fehler beim Überprüfen des Tipps');
    });
}

//Löscht alten Tipp und speichert Neuen
function deleteAndSaveTip(tipData) {
    // Löschen
    fetch(`/delete-tip/${tipData.user_id}/${tipData.game_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Alter Tipp erfolgreich gelöscht.');

            // Speichern
            fetch('/save-tip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tipData)
            })
            .then(response => response.json())
            .then(data => {
                window.alert(data.message);
            })
                // Error catches
            .catch(error => {
                console.error('Error saving tip after deletion:', error);
                window.alert('Fehler beim Speichern des neuen Tipps nach Löschung des alten Tipps');
            });
        } else {
            console.error('Fehler beim Löschen des alten Tipps:', response.status);
            window.alert('Fehler beim Löschen des alten Tipps');
        }
    })
    .catch(error => {
        console.error('Error deleting tip:', error);
        window.alert('Fehler beim Löschen des alten Tipps');
    });
}


//  Prüfe, ob die Eingabe eine Zahl ist, eine ganze Zahl ist und nicht negativ ist
//  Hier benötigt um zu prüfen, ob ein realistisches Ergebnis getippt wurde
function isNaturalNumberOrZero(input) {
    const number = Number(input);

    if (!isNaN(number) && Number.isInteger(number) && number >= 0) {
        return true;
    } else {
        return false;
    }
}

//  Bei geöffnetem Tippfenster wird Tipp abgegeben, sobald Enter gedrückt wird
document.getElementById('guessteam1').addEventListener("keypress", function (event) {
    if (event.key == "Enter")
        saveguess();
});
document.getElementById('guessteam2').addEventListener("keypress", function (event) {
    if (event.key == "Enter")
        saveguess();
});


// Prüfen ob die Navigation geöffnet oder geschlossen ist
function navStatus() {
  if (document.body.classList.contains('hamburger-active')) {
   closesidebar();
 } 
 else {
   opensidebar();
 }
}

//Öffnet die Sidebar, wenn der Button ausgelöst wird
function opensidebar() {
    document.body.classList.add('hamburger-active');
    document.getElementById("sidebar").style.height = "100%";
    document.getElementById("sidebarfield").style.display = "block";
}

//Schließt die o.g. Sidebar wieder
function closesidebar() {
    document.body.classList.remove('hamburger-active');
    document.getElementById("sidebar").style.height = "0";
    document.getElementById("sidebarfield").style.display = "none";
}



//Öffnet übergebene Seite
//'home', 'points', 'results', 'rewards', 'management', 'login', 'logout
function openSite(site){
    switch(site) {
        case 'home':
            window.location.href = '/';
            break; 
        case 'management':
            window.location.href = '/management';
            break; 
        case 'points':
            window.location.href = '/points';
            break;
        case 'results':
            window.location.href = '/results';
            break;
        case 'rewards':
            window.location.href = '/rewards';
            break;  
        case 'management':
            window.location.href = '/management';
            break;
        case 'login':
            window.location.href = '/login';
            break;
        case 'logout':
            window.location.href = '/reset-session';
        default:
            console.log("Ungültige Route");
    }    
}

