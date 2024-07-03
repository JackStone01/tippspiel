//Ruft alle Funktionen auf, die die Buttons für die untersch. Spieltage erstellen
function createGames() {
    createHeader();
    createGamesDayOne();
    createGamesDayTwo();
    createGamesDayThree();
    createRoundOfSixteen();
    createQuarterfinals();
    createSemifinals();
    createFinals();
}


//Der Header, der universell eingesetzt werden kann
function createHeader() {
     // Erstellt Header für Desktop Ansicht
    const biggerHeader = document.createElement('header');
    biggerHeader.classList.add('biggerheader');



    const logoButton = document.createElement('button');
    logoButton.classList.add('logo');
    const insideLogo = document.createElement('div');
    insideLogo.classList.add('insideheader');
    const logoImage = document.createElement('img');
    logoImage.classList.add('emlogo');
    logoImage.src = 'pages/img/EM-Logo.png';
    logoImage.alt = 'Das UEFA Europameisterschaftslogo 2024';
    insideLogo.appendChild(logoImage);
    logoButton.appendChild(insideLogo);
    biggerHeader.appendChild(logoButton);

    // Erstellt die Buttons im großen Header
    const buttonTitles = ['Home', 'Punktestand', 'Eigene Ergebnisse', 'Preise', 'Verwaltung', 'Login', 'Logout'];
    const buttonIds = ['home', 'points', 'results', 'rewards', 'management', 'login', 'logout'];
    for (let i = 0; i < buttonTitles.length; i++) {
        const headerButton = document.createElement('button');
        headerButton.classList.add('headerbutton');
        headerButton.id = buttonIds[i];
        if (buttonIds[i] === 'management') {
            headerButton.onclick = () => {
                fetch('/management', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => {
                    if (response.status === 403) {
                        alert('Zugriff verweigert. Ungenügend Rechte.');
                    } else {
                        window.location.href = '/management';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            };
        } else {
            headerButton.onclick = () => openSite(buttonIds[i]);
        }
        const insideButton = document.createElement('div');
        insideButton.classList.add('insideheader');
        const buttonText = document.createElement('h2');
        buttonText.textContent = buttonTitles[i];
        insideButton.appendChild(buttonText);
        headerButton.appendChild(insideButton);
        biggerHeader.appendChild(headerButton);
    }

    // Erstellt Header mit Hamburger Menü für Mobile Ansicht
    const smallerHeader = document.createElement('header');
    smallerHeader.classList.add('smallerheader');

    // Button, der die Sidebar öffnet und schließt
    const hamburgerContainer = document.createElement('div');
    hamburgerContainer.id = 'hamburger';
    hamburgerContainer.className = 'hamburger-icon-container';
    hamburgerContainer.addEventListener('click', function () {
        navStatus();
    });
    smallerHeader.appendChild(hamburgerContainer);


    const hamburgerIcon = document.createElement('span');
    hamburgerIcon.className = 'hamburger-icon';


    hamburgerContainer.appendChild(hamburgerIcon);

    // Logo im Mobilen Header
    const smallerLogoImage = logoImage.cloneNode(true); // Clone logo image
    smallerHeader.appendChild(smallerLogoImage);


    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';


    // Erstellt die Buttons für Mobilen Header
    for (let i = 0; i < buttonTitles.length; i++) {
        const sidebarButton = document.createElement('button');
        sidebarButton.classList.add('buttonsidebar');
        const sidebarText = document.createElement('h3');
        sidebarText.textContent = buttonTitles[i];
        sidebarButton.appendChild(sidebarText);


        if (buttonTitles[i].toLowerCase() === 'login') {
            sidebarButton.id = 'login_sidebar';
        } else if (buttonTitles[i].toLowerCase() === 'logout') {
            sidebarButton.id = 'logout_sidebar';
        }

        sidebarButton.onclick = () => openSite(buttonIds[i]); // Assuming openSite takes lowercase argument
        sidebar.appendChild(sidebarButton);
    }


    document.getElementById('headline').appendChild(biggerHeader);
    document.getElementById('headline').appendChild(smallerHeader);
    smallerHeader.appendChild(sidebar);
}


//Erstelle alle Schaltflächen für Spiele des 1. Spieltages
function createGamesDayOne() {
    const one = 'dayonefirstdate';
    const two = 'dayoneseconddate';
    const three = 'dayonethirddate';
    const four = 'dayonefourthdate';
    const fife = 'dayonefifthdate';
    createGameButton('Deutschland', 'Schottland', '21:00', one, 'Jetzt noch schnell tippen');
    createGameButton('Ungarn', 'Schweiz', '15:00', two, 'Jetzt noch schnell tippen');
    createGameButton('Spanien', 'Kroatien', '18:00', two, 'Jetzt noch schnell tippen');
    createGameButton('Italien', 'Albanien', '21:00', two, 'Jetzt noch schnell tippen');
    createGameButton('Polen', 'Niederlande', '15:00', three, 'Platzhalter DB');
    createGameButton('Slowenien', 'Dänemark', '18:00', three, 'Dein Tipp: ');
    createGameButton('Serbien', 'England', '21:00', three, 'Platzhalter DB');
    createGameButton('Rumänien', 'Ukraine', '15:00', four, 'Jetzt noch schnell tippen');
    createGameButton('Belgien', 'Slowakei', '18:00', four, 'Platzhalter DB');
    createGameButton('Österreich', 'Frankreich', '21:00', four, 'Platzhalter DB');
    createGameButton('Türkei', 'Georgien', '18:00', fife, 'Jetzt noch schnell tippen');
    createGameButton('Portugal', 'Tschechien', '21:00', fife, 'Platzhalter DB');
}

//Erstelle alle Schaltflächen für Spiele des 2. Spieltages
function createGamesDayTwo() {
    const one = 'daytwofirstdate';
    const two = 'daytwoseconddate';
    const three = 'daytwothirddate';
    const four = 'daytwofourthdate';
    createGameButton('Kroatien', 'Albanien', '15:00', one, 'Platzhalter DB');
    createGameButton('Deutschland', 'Ungarn', '18:00', one, 'Platzhalter DB');
    createGameButton('Schottland', 'Schweiz', '21:00', one, 'Platzhalter DB');
    createGameButton('Slowenien', 'Serbien', '15:00', two, 'Platzhalter DB');
    createGameButton('Dänemark', 'England', '18:00', two, 'Platzhalter DB');
    createGameButton('Spanien', 'Italien', '21:00', two, 'Platzhalter DB');
    createGameButton('Slowakei', 'Ukraine', '15:00', three, 'Platzhalter DB');
    createGameButton('Polen', 'Österreich', '18:00', three, 'Platzhalter DB');
    createGameButton('Niederlande', 'Frankreich', '21:00', three, 'Platzhalter DB');
    createGameButton('Georgien', 'Tschechien', '15:00', four, 'Platzhalter DB');
    createGameButton('Türkei', 'Portugal', '18:00', four, 'Platzhalter DB');
    createGameButton('Belgien', 'Rumänien', '21:00', four, 'Platzhalter DB');
}

//Erstelle alle Schaltflächen für Spiele des 3. Spieltages
function createGamesDayThree() {
    const one = 'daythreefirstdate';
    const two = 'daythreeseconddate';
    const three = 'daythreethirddate';
    const four = 'daythreefourthdate';
    const db = 'Platzhalter DB'
    createGameButton('Schweiz', 'Deutschland', '21:00', one, db);
    createGameButton('Schottland', 'Ungarn', '21:00', one, db);
    createGameButton('Kroatien', 'Italien', '21:00', two, db);
    createGameButton('Albanien', 'Spanien', '21:00', two, db);
    createGameButton('Frankreich', 'Polen', '18:00', three, db);
    createGameButton('Niederlande', 'Österreich', '18:00', three, db);
    createGameButton('England', 'Slowenien', '21:00', three, db);
    createGameButton('Dänemark', 'Serbien', '21:00', three, db);
    createGameButton('Ukraine', 'Belgien', '18:00', four, db);
    createGameButton('Slowakei', 'Rumänien', '18:00', four, db);
    createGameButton('Tschechien', 'Türkei', '21:00', four, db);
    createGameButton('Georgien', 'Portugal', '21:00', four, db);
}

//  Erstellt mithilfe der API Schaltflächen für das Achtelfinale
async function createRoundOfSixteen() {
    try {
        const games = await fetchGamesByPhase('Achtelfinale');

        games.forEach((game, index) => {
            const {team1, team2, time, date} = game;
            const gameDate = new Date(date).toISOString().split('T')[0];


            let container;
            if (gameDate === '2024-06-29') {
                container = 'dayfourfirstdate';
            } else if (gameDate === '2024-06-30') {
                container = 'dayfourseconddate';
            } else if (gameDate === '2024-07-01') {
                container = 'dayfourthirddate';
            } else if (gameDate === '2024-07-02') {
                container = 'dayfourfourthdate';
            }


            createGameButton(team1, team2, time, container, 'Platzhalter DB');
        });

    } catch (error) {
        console.error('Error creating games for day one:', error.message);
    }


}

//  Erstellt mithilfe der API Schaltflächen für das Viertelfinale
async function createQuarterfinals() {
    try {
        const games = await fetchGamesByPhase('Viertelfinale');

        games.forEach((game, index) => {
            const {team1, team2, time, date} = game;
            const gameDate = new Date(date).toISOString().split('T')[0];


            let container;
            if (gameDate === '2024-07-05') {
                container = 'dayfivefirstdate';
            } else if (gameDate === '2024-07-06') {
                container = 'dayfiveseconddate';
            }


            createGameButton(team1, team2, time, container, 'Platzhalter DB');
        });

    } catch (error) {
        console.error('Error creating games for day one:', error.message);
    }


}

//  Erstellt mithilfe der API Schaltflächen für das Halbfinale
async function createSemifinals() {
    try {
        const games = await fetchGamesByPhase('Halbfinale');

        games.forEach((game, index) => {
            const {team1, team2, time, date} = game;
            const gameDate = new Date(date).toISOString().split('T')[0];


            let container;
            if (gameDate === '2024-07-09') {
                container = 'daysixfirstdate';
            } else if (gameDate === '2024-07-10') {
                container = 'daysixseconddate';
            }

            createGameButton(team1, team2, time, container, 'Platzhalter DB');
        });

    } catch (error) {
        console.error('Error creating games for day one:', error.message);
    }


}

//  Erstellt mithilfe der API Schaltflächen für das große und kleine Finale
async function createFinals() {
    try {
        const games = await fetchGamesByPhase('Finale');

        games.forEach((game, index) => {
            const {team1, team2, time, date} = game;
            const gameDate = new Date(date).toISOString().split('T')[0];


            const container = 'daysevenfirstdate';

            createGameButton(team1, team2, time, container, 'Platzhalter DB');
        });

    } catch (error) {
        console.error('Error creating games for day one:', error.message);
    }

}

//Zeigt bei Auswahl des Dropdowns den jeweiligen Spieltag an
function gameday_select(x) {
    document.getElementById("st1").style.display = "none";
    document.getElementById("st2").style.display = "none";
    document.getElementById("st3").style.display = "none";
    document.getElementById("st4").style.display = "none";
    document.getElementById("st5").style.display = "none";
    document.getElementById("st6").style.display = "none";
    document.getElementById("st7").style.display = "none";
    document.getElementById("st" + x.charAt(x.length - 1)).style.display = "flex";
}

//Erzeugt bei Auswahl des jeweiligen Spieltages die Spiele dieses Tages
function selectGamedays() {
    const value = document.getElementById("gameday").value;
    gameday_select(value);
    switch (value) {
        case 'st1':
            createGamesDayOne();
            break;
        case 'st2':
            createGamesDayTwo();
            break;
        case 'st3':
            createGamesDayThree();
            break;
        case 'st4':
            createRoundOfSixteen();
            break;
        case 'st5':
            createQuarterfinals();
            break;
        case 'st6':
            createSemifinals();
            break;
        case 'st7':
            createFinals();
            break;
    }
}


let team1Name = "";
let team2Name = "";


// Ruft das Tippfenster auf, dass in der home.html steht und passt Teamnamen an
function createGuessWindow(team1, team2, time, status) {
    console.log('Team 1:', team1);
    console.log('Team 2:', team2);
    team1Name = team1;
    team2Name = team2;

    const country1 = document.getElementById('team1');
    const country2 = document.getElementById('team2');
    const flagcountry1 = document.getElementById('flag1');
    const flagcountry2 = document.getElementById('flag2');
    const guess1 = document.getElementById('guessteam1');
    const guess2 = document.getElementById('guessteam2');

    country1.textContent = team1;
    country2.textContent = team2;
    flagcountry1.src = 'pages/img/' + team1 + '.png';
    flagcountry2.src = 'pages/img/' + team2 + '.png';
    guess1.value = "";
    guess2.value = "";

    // Versucht game ID durch Teamnamen zu erhalten
    fetchGameId(team1, team2)
        .then(responseGameId => {
            if (responseGameId) {
                console.log('Game ID:', responseGameId);
                window.gameId = responseGameId;
            } else {
                console.error('Failed to fetch game ID');

            }
        })
        .catch(error => {
            console.error('Error:', error);

        });


    document.getElementById('guessingwindow').style.display = "flex";

}

//  Schließt das Popup, sobald außerhalb des Popups geklickt wird
window.onclick = function (event) {
    if (event.target == popup)
        closePopup();
}

//  Schließt das Popup zum Tippen wieder
function closePopup() {
    document.getElementById('guessingwindow').style.display = "none";
}



// funktion zum erhalten der GameID
function fetchGameId(team1, team2) {

    return fetch('/api/games?team1=' + team1 + '&team2=' + team2)
        .then(response => {
            if (!response.ok) {

                throw new Error('Failed to fetch game ID');
            }
            return response.json();
        })
        .then(data => {

            // Loop durch alle games bis passende kombination gefunden wird
            for (const game of data) {
                if (game.team1 === team1 && game.team2 === team2) {

                    if (game.team1_goals === 0 && game.team2_goals === 0) {

                        return game.id;
                    }

                }
            }

            return null;
        })
        .catch(error => {
            console.error('Error:', error);


        });
}


//GameScores aus der Games db erhalten mitzusätzlicher Datums-Abfrage um zwischen Games mit Teams mit den selben Namen zu Unterscheiden
function fetchGameScores(team1, team2, datum, zeit) {
    // Datemap um Html bezeichnungen in passende Datumsangaben zu wandeln
    const dateMap = {
        'dayonefirstdate': '2024-06-14',
        'dayoneseconddate': '2024-06-15',
        'dayonethirddate': '2024-06-16',
        'dayonefourthdate': '2024-06-17',
        'dayonefifthdate': '2024-06-18',
        'daytwofirstdate': '2024-06-19',
        'daytwoseconddate': '2024-06-20',
        'daytwothirddate': '2024-06-21',
        'daytwofourthdate': '2024-06-22',
        'daythreefirstdate': '2024-06-23',
        'daythreeseconddate': '2024-06-24',
        'daythreethirddate': '2024-06-25',
        'daythreefourthdate': '2024-06-26',
        'dayfourfirstdate': '2024-06-29',
        'dayfourseconddate': '2024-06-30',
        'dayfourthirddate': '2024-07-01',
        'dayfourfourthdate': '2024-07-02',
        'dayfivefirstdate': '2024-07-05',
        'dayfiveseconddate': '2024-07-06',
        'daysixfirstdate': '2024-07-09',
        'daysixseconddate': '2024-07-10',
        'daysevenfirstdate': '2024-07-14'
    };

    const dateKey = `${datum}`;
    const gameDate = dateMap[dateKey];

    if (!gameDate) {
        console.error('Date not found in dateMap');
        return Promise.resolve(null);
    }
    // Fetch aufruf nach spezifischer Suche nach Teams und Datum

    return fetch(`/api/games?team1=${team1}&team2=${team2}&date=${gameDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch game data');
            }
            return response.json();
        })
        .then(data => {
            const now = new Date();
            for (const game of data) {
                // Überprüft ob Spiel schon gestartet ist um Tippabgaben nach Start zu vermeiden
                if (game.team1 === team1 && game.team2 === team2 && game.date === gameDate) {
                    let [hours, minutes] = game.time.split(':').map(Number);
                    hours = (hours + 2) % 24; // +2 Stunden hinzufügen und Stunden im 24-Stunden-Format behalten
                    const adjustedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
                    const gameDateTime = new Date(`${game.date}T${adjustedTime}`);
                    const gameStarted = now >= gameDateTime;
                    return {
                        gameStarted,
                        team1Goals: game.team1_goals,
                        team2Goals: game.team2_goals,
                        team1_name: game.team1,
                        team2_name: game.team2
                    };
                }
            }
            return null;
        })
        .catch(error => {
            console.error('Error fetching game data:', error);
            return null;
        });
}

// Spiele zu passenden Group/IDs
async function fetchGamesByPhase(phaseName) {
    try {
        const response = await fetch(`/api/games/${phaseName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${phaseName} games`);
        }
        const games = await response.json();
        return games;
    } catch (error) {
        console.error(`Error fetching ${phaseName} games:`, error.message);
        return [];
    }
}


// Funktion, die sowohl die gameId abruft als auch die saveguess-Funktion aufruft
function fetchGameIdAndSaveGuess() {

    fetchGameId(team1Name, team2Name)

        .then(responseGameId => {
            if (responseGameId) {
                console.log('Game ID:', responseGameId);
                // Aufrufen der saveguess Funktion mit der gameId als Argument
                saveguess(responseGameId);
            } else {
                console.error('Failed to fetch game ID');

            }
        })
        .catch(error => {
            console.error('Error:', error);


        });
        closePopup();
}

// Funktion zur Formatierung der Zeit
function formatTime(timeString) {
    // Zeitstring ohne Umwandlung in ein Date-Objekt verwenden
    const [hours, minutes] = timeString.split(':').map(Number);
    console.log('Extracted hours:', hours);
    console.log('Extracted minutes:', minutes);

    // 2 Stunden hinzufügen da DB andere Zeitzone nutzt
    let newHours = (hours + 2) % 24;
    // Falls die neuen Stunden 0 sind
    if (newHours < 10) newHours = `0${newHours}`;
    // Falls die Minuten einstellig sind
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${newHours}:${formattedMinutes}`;
}

// Erstellt einen Button, der Land 1, 2, die Zeit, das Datum und den aktuellen Tipp Stand bekommt
// Die Länderflagge wird automatisch anhand der Ländernamen generiert
function createGameButton(land1, land2, zeit, datum, status) {
    console.log('Creating game button with:', { land1, land2, zeit, datum, status });
    const formattedTime = formatTime(zeit);
    console.log('Formatted time:', formattedTime);

    fetchGameScores(land1, land2, datum, zeit)
        .then(response => {
            if (!response) {
                console.error('No game data found for', land1, land2);
                return;
            }

            const selected_day = document.getElementById(datum);
            if (!selected_day) {
                console.error('No element found with id:', datum);
                return;
            }

            console.log('Response from fetchGameScores:', response);

            if (!response.gameStarted) {
                const button = document.createElement('button');
                button.className = 'gamebutton';
                button.addEventListener('click', function () {
                    createGuessWindow(land1, land2, formattedTime, status);
                });

                const gameDiv = document.createElement('div');
                gameDiv.className = 'game';

                const teamsDiv = document.createElement('div');
                teamsDiv.className = 'teams';

                const team1Logo = document.createElement('img');
                team1Logo.className = 'teamlogos';
                team1Logo.src = 'pages/img/' + land1 + '.png';
                team1Logo.alt = `Logo ${land1}`;

                const team2Logo = document.createElement('img');
                team2Logo.className = 'teamlogos';
                team2Logo.src = 'pages/img/' + land2 + '.png';
                team2Logo.alt = `Logo ${land2}`;

                const teamsHeader = document.createElement('h3');
                teamsHeader.textContent = `${land1} - ${land2}`;

                teamsDiv.appendChild(team1Logo);
                teamsDiv.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
                teamsDiv.appendChild(teamsHeader);
                teamsDiv.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
                teamsDiv.appendChild(team2Logo);

                const gameInfoDiv = document.createElement('div');
                gameInfoDiv.className = 'gameinfo';

                const timeHeader = document.createElement('h4');
                timeHeader.textContent = `${formattedTime} Uhr`;

                const statusParagraph = document.createElement('p');
                statusParagraph.textContent = 'Jetzt noch schnell tippen!'; // Temporäre Lösung

                gameInfoDiv.appendChild(timeHeader);
                gameInfoDiv.appendChild(statusParagraph);

                gameDiv.appendChild(teamsDiv);
                gameDiv.appendChild(gameInfoDiv);

                button.appendChild(gameDiv);
                selected_day.appendChild(button);
            } else {
                const gameDiv = document.createElement('div');
                gameDiv.className = 'game';

                const teamsDiv = document.createElement('div');
                teamsDiv.className = 'teams';

                const team1Logo = document.createElement('img');
                team1Logo.className = 'teamlogos';
                team1Logo.src = 'pages/img/' + land1 + '.png';
                team1Logo.alt = `Logo ${land1}`;

                const team2Logo = document.createElement('img');
                team2Logo.className = 'teamlogos';
                team2Logo.src = 'pages/img/' + land2 + '.png';
                team2Logo.alt = `Logo ${land2}`;

                const teamsHeader = document.createElement('h3');
                teamsHeader.textContent = `${land1} - ${land2}`;
                teamsHeader.style.fontSize = '0.85em';
                teamsHeader.style.fontWeight = 'bold';
                teamsHeader.style.marginTop = '10px';

                teamsDiv.appendChild(team1Logo);
                teamsDiv.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
                teamsDiv.appendChild(teamsHeader);
                teamsDiv.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
                teamsDiv.appendChild(team2Logo);

                const gameInfoContainer = document.createElement('div');
                gameInfoContainer.className = 'gameinfo-container';

                const gameInfoDiv = document.createElement('div');
                gameInfoDiv.className = 'gameinfo';

                const timeHeader = document.createElement('h4');
                timeHeader.textContent = `Spiel beendet!`;
                timeHeader.style.fontSize = '0.85em';

                const scoreParagraph = document.createElement('p');
                scoreParagraph.textContent = `Endergebnis: ${response.team1Goals} - ${response.team2Goals}`;
                scoreParagraph.style.fontSize = '0.95em';
                scoreParagraph.style.fontWeight = 'bold';
                scoreParagraph.style.marginTop = '10px';

                gameInfoDiv.appendChild(timeHeader);
                gameInfoDiv.appendChild(scoreParagraph);

                gameDiv.appendChild(teamsDiv);
                gameDiv.appendChild(gameInfoDiv);

                gameInfoContainer.appendChild(gameDiv);
                selected_day.appendChild(gameInfoContainer);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



async function loadHistoryAndHeader() {
    createHeader();
    await loadTipHistory();
}

// Funktion zum Laden der Tipp-History des eingeloggten Users
async function loadTipHistory() {
    try {
        //Aufruf der getCurrentUserId
        const userId = await getCurrentUserId();
        if (!userId) {
        window.alert('Fehler beim Abrufen der Benutzer-ID');
        return;
          }
        // Tipps-Daten abrufen
        const tippsResponse = await fetch(`/api/tipps?user_id=${userId}`);
        if (!tippsResponse.ok) {
            throw new Error('Fehler beim Abrufen der Tipps');
        }
        const tipps = await tippsResponse.json();

        // Spiele-Daten abrufen
        const gamesResponse = await fetch('/api/games');
        if (!gamesResponse.ok) {
            throw new Error('Fehler beim Abrufen der Spiele');
        }
        const games = await gamesResponse.json();

        const tipHistoryContainer = document.getElementById('tipHistoryContainer');
        tipHistoryContainer.innerHTML = '';

        //erstellen aller Tipps über die CreateGameItem funktion
        for (let i = 0; i < tipps.length; i++) {
            const tipp = tipps[i];
            const game = games.find(game => game.id === tipp.game_id);
            if (!game) continue;

            const gameItem = createGameItem(game, tipp);
            tipHistoryContainer.appendChild(gameItem);
        }
        //Funktion zum Anzeigen des UserScores
       await displayCurrentScore(userId);

    } catch (error) {
        console.error('Fehler beim Abrufen oder Anzeigen der Tipphistorie:', error.message);
    }
}

//Erstellt einzelne Tipps
function createGameItem(game, tipp) {
    const gameItem = document.createElement('li');
    gameItem.className = 'single-tip';

    //Baut die einzelnen Tipp elemente aus drei Columns auf
    const leftColumn = createLeftColumn(game, tipp);
    const middleColumn = createMiddleColumn(game, tipp);
    const rightColumn = createRightColumn(game, tipp);

    gameItem.appendChild(leftColumn);
    gameItem.appendChild(middleColumn);
    gameItem.appendChild(rightColumn);

    return gameItem;
}


//Erzeugt linken Teil des Tipps mit den Landschaftsflagen und den Teamnamen
function createLeftColumn(game, tipp) {
    const leftColumn = document.createElement('div');
    leftColumn.className = 'left-column';

    // Teamlogos und Mannschaftsnamen
    const teamDetails = document.createElement('div');
    teamDetails.className = 'team-details';

    //Aufruf der CreateTeamLogo funktion

    const team1Logo = createTeamLogo(game.team1);
    const team1Name = document.createElement('span');
    team1Name.className = 'team-name';
    team1Name.textContent = game.team1;

    const team2Logo = createTeamLogo(game.team2);
    const team2Name = document.createElement('span');
    team2Name.className = 'team-name';
    team2Name.textContent = game.team2;

    teamDetails.appendChild(team1Logo);
    teamDetails.appendChild(team1Name);
    teamDetails.appendChild(document.createTextNode(' gegen '));
    teamDetails.appendChild(team2Name);
    teamDetails.appendChild(team2Logo);

    leftColumn.appendChild(teamDetails);

    return leftColumn;
}

//Erzeugen des mittleren Teils mit den Ergebnissen oder Platzhalter und Tipp Scores
function createMiddleColumn(game, tipp) {
    const middleColumn = document.createElement('div');
    middleColumn.className = 'middle-column';

    // Ergebnis
    const resultInfo = document.createElement('div');
    resultInfo.className = 'result-info';
    if (game.ScoresForGameUpdated) {
        resultInfo.textContent = `Ergebnis: ${game.team1_goals} : ${game.team2_goals}`;
    } else {
        resultInfo.textContent = `Noch kein Ergebnis! Spiel findet am ${game.date} statt.`;
    }

    middleColumn.appendChild(resultInfo);

    // Tipp
    const tippInfo = document.createElement('div');
    tippInfo.className = 'tipp-info';
    tippInfo.textContent = `Dein Tipp: ${tipp.team1_score} : ${tipp.team2_score}`;

    middleColumn.appendChild(tippInfo);

    return middleColumn;
}

// rechten Teil des Tipps erstellen
function createRightColumn(game, tipp) {
    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';

    // Punkte oder "Spiel noch offen"
    const pointsInfo = document.createElement('div');
    pointsInfo.className = 'points';
    if (game.ScoresForGameUpdated) {
        const pointsValue = calculatePoints(tipp, game);
        pointsInfo.textContent = pointsValue === 0 ? 'Punkte: 0' : `Punkte: +${pointsValue}`;
        pointsInfo.classList.add(pointsValue === 3 ? 'points-green' : pointsValue === 1 ? 'points-light-green' : 'points-red');
    } else {
        pointsInfo.innerHTML = 'Tipp abgegeben! <br> Viel Glück!'; // Hier wird der Zeilenumbruch hinzugefügt
        pointsInfo.classList.add('points-open');
    }

    rightColumn.appendChild(pointsInfo);

    return rightColumn;
}


// funktion zum erhalten der TeamLogos anhand der Teamnamen
function createTeamLogo(teamName) {
    const teamLogo = document.createElement('img');
    teamLogo.className = 'team-logo';
    teamLogo.src = `pages/img/${teamName}.png`;
    teamLogo.alt = `Flagge ${teamName}`;

    return teamLogo;
}

// FUnktion zur berechnung der Punkte
function calculatePoints(tipp, game) {
    // Logik zur Punkteberechnung basierend auf den getippten und tatsächlichen Ergebnissen
    if (tipp.team1_score === game.team1_goals && tipp.team2_score === game.team2_goals) {
        return 3; // Perfekter Tipp
    } else if ((game.team1_goals > game.team2_goals && tipp.team1_score > tipp.team2_score) ||
               (game.team1_goals < game.team2_goals && tipp.team1_score < tipp.team2_score) ||
               (game.team1_goals === game.team2_goals && tipp.team1_score === tipp.team2_score)) {
        return 1; // Korrektes Spielende (Sieg/Niederlage oder Unentschieden)
    } else {
        return 0; // Keine Punkte
    }
}


//Funktion zum Anzeigen des eingeloggten User Scores

async function displayCurrentScore(userId) {
    try {



        // Benutzerdaten (inkl. Punktestand) abrufen über die vorhandene API-Route
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen des Benutzers');
        }
        const userData = await response.json();
        const data = userData.data ? JSON.parse(userData.data) : {};
        const currentScore = data.score;

        // DOM-Element für die Anzeige des aktuellen Punktestands
        const currentScoreContainer = document.getElementById('currentScore');
        if (currentScore === undefined) {
            currentScoreContainer.textContent = 'Punktestand nicht verfügbar';
        } else {
            currentScoreContainer.textContent = `Dein aktueller Punktestand: ${currentScore} Punkte`;
        }

    } catch (error) {
        console.error('Fehler beim Abrufen des Punktestands:', error.message);
        const currentScoreContainer = document.getElementById('currentScore');
        currentScoreContainer.textContent = 'Punktestand nicht verfügbar';
    }
}
