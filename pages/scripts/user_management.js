// Öffnet Popup, in dem Neuer Benutzer eingetragen werden kann
function new_user() {
    document.getElementById('popup').style.display = "flex";
    document.getElementById('username').value = '';
    document.getElementById('role').value = 'guesser'; // Standardrolle auf Spieler setzen
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.getElementById('submit-new-user').style.display = 'block';

    // Entferne den 'Speichern' Button, falls er existiert
    const saveButton = document.querySelector('.savebutton');
    if (saveButton) {
        saveButton.remove();
    }
}



// Schließt Popup wieder
function closepopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById('username').value = '';
    document.getElementById('role').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    // Entferne den 'Speichern' Button, falls er existiert
    const saveButton = document.querySelector('.savebutton');
    if (saveButton) {
        saveButton.remove();
    }
}


//Schließt popup, wenn außerhalb geklickt wird
window.onclick = function (event) {
    var new_user = document.getElementById("popup");
    if (event.target == new_user) {
        closepopup();
    }
}




//lädt alle User und stellt sie auf der Seite dar
function loadUsers() {
    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(user => {
                const { name, data } = user;
                const userData = JSON.parse(data);
                const { role } = userData; // Role extrahieren
                createNewUserEntry(name, role);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
//Funktion um in der Html mit Onload die CreateHeader und LoadUsers funktionen zu callen
//Anmerkung: Onload geht nur für eine Funktion daher diese Umlagerung
function HeaderandLoadUsercall() {
    loadUsers();
    createHeader();
    getPrices();
}
function HeaderandPreisecall() {
    createHeader();
    getPrices();
}

//Prüft eingegebene Werte und fügt Nutzer dann der Datenbank hinzu
async function add_user() {
    const username = document.getElementById('username').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const password_check = document.getElementById('password-confirm').value;

    if (username === "" || role === "" || password === "") {
        window.alert('Bitte alle Felder ausfüllen');
        return;
    } else if (password !== password_check) {
        window.alert('Passwörter stimmen nicht überein');
        return;
    }

    try {
        const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username, password, role })
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message);
        }


        window.alert('Benutzer erfolgreich erstellt');


        createNewUserEntry(username, role);
        closepopup();
    } catch (error) {
        console.error('Error creating user:', error.message);


        window.alert('Benutzername bereits vergeben.');
    }
}



//Löscht den ausgewählten Benutzer
function delete_usr(username) {
    fetch(`/api/users/${username}`, { // Use `username` as parameter for DELETE request
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.log('User deleted successfully:', data.message);
                const user = document.getElementById(username);
                if (user) {
                    user.remove();
                }
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


//Erstellt ein neues Element in der Liste von Usern
function createNewUserEntry(username, role) {
    const userlist = document.getElementById('userlist');
    const listitem = document.createElement('div');
    listitem.className = 'single-user';
    listitem.id = username;
    const editbuttons = document.createElement('div');
    editbuttons.className = 'editbuttons';

    const usr_name = document.createElement('h3');
    const rle = document.createElement('h3');
    usr_name.textContent = username;
    rle.textContent = role;
    rle.style.marginRight = '5px';

    const trashpic = document.createElement('img');
    trashpic.src = 'pages/img/trash-solid.svg';
    trashpic.alt = 'Mülleimer Symbol';
    trashpic.width = 16;
    trashpic.height = 16;

    const delete_user = document.createElement('button');
    delete_user.addEventListener('click', function () {
        delete_usr(username);
    });
    delete_user.className = 'UserButton delete';

    userlist.appendChild(listitem);
    listitem.appendChild(usr_name);
    listitem.appendChild(editbuttons);
    editbuttons.appendChild(rle);
    editbuttons.appendChild(delete_user);
    delete_user.appendChild(trashpic);
}

function getPrices() {
    fetch('/api/preise')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Überprüfe die empfangenen Daten

            // Unterscheidung basierend auf der Seitennamen
            const currentPage = getPageName(); // Funktion zur Ermittlung der Seitennamen
            switch (currentPage) {
                case 'management':
                case 'rewards':
                    updateManagementPage(data);
                    break;
                case 'points':
                    updatePointsPage(data);
                    break;
                default:
                    console.error('Unrecognized page:', currentPage);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Funktion zur Ermittlung der aktuellen Seitennamen
function getPageName() {
    // Annahme: Die aktuelle URL wird verwendet, um den Seitennamen zu bestimmen
    const url = window.location.pathname;
    const pageName = url.substring(url.lastIndexOf('/') + 1); // extrahiert den Seitennamen aus der URL
    return pageName;
}

// Funktion zur Aktualisierung der management.html Seite
function updateManagementPage(data) {
    // UI aktualisieren für management.html
    document.getElementById('PriceFirstPlace').textContent = getPriceDescription(data, 1);
    document.getElementById('PriceSecondPlace').textContent = getPriceDescription(data, 2);
    document.getElementById('PriceThirdPlace').textContent = getPriceDescription(data, 3);
    document.getElementById('PriceFourthPlace').textContent = getPriceDescription(data, 4);

    // Update für mobile Version
    document.getElementById('PriceFirstPlaceMobile').textContent = getPriceDescription(data, 1);
    document.getElementById('PriceSecondPlaceMobile').textContent = getPriceDescription(data, 2);
    document.getElementById('PriceThirdPlaceMobile').textContent = getPriceDescription(data, 3);
}

// Funktion zur Aktualisierung der points.html Seite
function updatePointsPage(data) {
    // UI aktualisieren für points.html (Klassen .PriceFourthPlace)
    document.getElementById('PriceFirstPlace').textContent = getPriceDescription(data, 1);
    document.getElementById('PriceSecondPlace').textContent = getPriceDescription(data, 2);
    document.getElementById('PriceThirdPlace').textContent = getPriceDescription(data, 3);
    document.querySelectorAll('.PriceFourthPlace').forEach(elem => {
        elem.textContent = getPriceDescription(data, 4);
    });

        // Update für mobile Version
        document.getElementById('PriceFirstPlaceMobile').textContent = getPriceDescription(data, 1);
        document.getElementById('PriceSecondPlaceMobile').textContent = getPriceDescription(data, 2);
        document.getElementById('PriceThirdPlaceMobile').textContent = getPriceDescription(data, 3);
}

// Funktion zur Beschreibung der Preise abhängig von der Platzierung
function getPriceDescription(data, place) {
    // Annahme: data ist ein Array von Preisbeschreibungen oder Objekten
    // Hier wird angenommen, dass data[place-1] das richtige Preisobjekt für den Platz ist
    if (data && data.length >= place) {
        return data[place - 1].description; // Annahme: Beschreibung des Preises
    } else {
        return 'Preis nicht verfügbar';
    }
}

// Hier wird überprüft, ob die DOM geladen wurde, bevor die Funktion ausgeführt wird
document.addEventListener('DOMContentLoaded', getPrices);



// Funktion zum Speichern eines Preises
function savePrice() {
    const currentPlace = document.getElementById('price-place').textContent;
    const priceDescription = document.getElementById('price-input').value;

    fetch('/api/preise', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ place: currentPlace, description: priceDescription })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Daten erfolgreich gespeichert, jetzt UI aktualisieren
            getPrices(); // Hier wird die getPrices Funktion aufgerufen, um die UI zu aktualisieren
            closePricePopup(); // Popup schließen
        })
        .catch(error => console.error('Error:', error));
}


// Function to edit a price (assuming it opens a popup and sets values)
function editPrice(place) {
    document.getElementById('price-place').textContent = place;
    document.getElementById('price-input').value = document.getElementById(`Price${place === 4 ? 'Fourth' : (['First', 'Second', 'Third'][place - 1])}Place`).textContent;
    document.getElementById('price-popup').style.display = 'flex';
}

// Function to close the price edit popup
function closePricePopup() {
    document.getElementById('price-popup').style.display = 'none';
}


async function fetchAndDisplayUserScores() {
    try {
        const response = await fetch('/points/api/user-scores');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const users = await response.json();

        // Update podium placements
        if (users.length > 0) {
            document.getElementById('name_of_p1').textContent = `${users[0].name}`;
            document.getElementById('points_of_p1').textContent = `${users[0].score} Punkte`;
            document.getElementById('pointsp1').textContent = `${users[0].score} Punkte`;
        }
        if (users.length > 1) {
            document.getElementById('name_of_p2').textContent = `${users[1].name}`;
            document.getElementById('points_of_p2').textContent = `${users[1].score} Punkte`;
            document.getElementById('pointsp2').textContent = `${users[1].score} Punkte`;
        }
        if (users.length > 2) {
            document.getElementById('name_of_p3').textContent = `${users[2].name}`;
            document.getElementById('points_of_p3').textContent = `${users[2].score} Punkte`;
            document.getElementById('pointsp3').textContent = `${users[2].score} Punkte`;
        }

        // Update lower ranks
        for (let i = 3; i < users.length; i++) {
            const place = i + 1;
            const placeElement = document.getElementById(`p${place}`);
            const pointsElement = document.getElementById(`pointsp${place}`);
            if (placeElement && pointsElement) {
                placeElement.textContent = `Platz ${place}`;
                pointsElement.textContent = `${users[i].score} Punkte`;
            }
        }

        // Get current user's placement
        const currentUserResponse = await fetch('/api/current_user');
        if (!currentUserResponse.ok) {
            throw new Error('Network response was not ok ' + currentUserResponse.statusText);
        }
        const currentUser = await currentUserResponse.json();

        const currentUserDetailsResponse = await fetch(`/api/users/${currentUser.user_id}`);
        if (!currentUserDetailsResponse.ok) {
            throw new Error('Network response was not ok ' + currentUserDetailsResponse.statusText);
        }
        const currentUserDetails = await currentUserDetailsResponse.json();
        const currentUserData = JSON.parse(currentUserDetails.data);

        const ownPlacementElement = document.getElementById('ownplacement');
        const ownPointsElement = document.getElementById('ownpoints');
        const currentUserIndex = users.findIndex(user => user.id === currentUser.user_id);

        ownPlacementElement.textContent = `${currentUserIndex + 1}. Platz`;
        ownPointsElement.textContent = `${currentUserData.score} Punkte`;

    } catch (error) {
        console.error('Error fetching user scores:', error);
    }
}

function HeaderandScoresCall() {
    fetchAndDisplayUserScores();
    getPrices();
    createHeader();
}








