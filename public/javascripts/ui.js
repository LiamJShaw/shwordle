// Initialise game
let guess = "";
let guesses = 0;
let generatedWord;
let gameBoardArray = [];
let gameEnded;
let customChallenge = false;

let scores = [];

function newGame() {

    gameBoard.textContent = "";

    customChallenge = false;
    gameEnded = false;
    guess = "";
    guesses = 0;

    generateBoard(6, 5);
}

document.addEventListener('DOMContentLoaded', function() {
    
    if (userName) {
        console.log("User:", userName);
        console.log("Scores:", userScores)
    }

    console.log("Word:", backendWord);

    scores = userScores;

    if (userScores.length === 0) {
        showHelpModal();
    }

    gameEnded = false;

    generatedWord = backendWord;
    newGame();

    const statsButton = document.querySelector(".statsButton");
    statsButton.addEventListener("click", showResultsModal);

    const helpButton = document.querySelector(".helpButton");
    helpButton.addEventListener("click", showHelpModal);

    const settingsButton = document.querySelector(".settingsButton");
    settingsButton.addEventListener("click", showSettingsModal);

    const customChallengeButton = document.querySelector(".customChallengeButton");
    customChallengeButton.addEventListener("click", customChallengeMode);

});

// Inputs

// Physical keyboard
document.addEventListener('keydown', (event) => {

    let key = event.key;
    let allowedChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
                        'h', 'i', 'j', 'k', 'l', 'm', 'n',
                        'o', 'p', 'q', 'r', 's', 't', 'u',
                        'v', 'w', 'x', 'y', 'z'];
    
    if (allowedChars.includes(key.toLowerCase())) {
        pressKey(key);
    }

    if (key === "Enter") {

        if (customChallenge) {
            generateLink();
        } else {
            submitGuess();
        }
    }

    if (key === "Backspace") {
        deleteChar(); 
    }
    
})

const keyboard = document.querySelector(".keyboard");
keyboard.addEventListener("click", handleMouseClick);

function handleMouseClick(e) {

    if (e.target.matches("[data-enter]")) {
        if (customChallenge) {
            generateLink();
        } else {
            submitGuess();
        }
    }

    if (e.target.matches("[data-key]")) {
        let keyElement = e.target;
        keyElement.classList.add('grey-out');
        setTimeout(() => {
            keyElement.classList.remove('grey-out');
        }, 100);
        pressKey(keyElement.dataset.key);
    }

    if (e.target.matches("[data-delete]")) {
        deleteChar(); 
    }
}

//  Virtual keyboard
window.addEventListener('keydown', function (e) {
    let selector;
    
    if (e.code === "Enter") {
        selector = "[data-enter]";
    } else if (e.code === "Backspace") {
        selector = "[data-delete]";
    } else {
        selector = `[data-key='${e.key.toLowerCase()}']`;
    }

    let button = keyboard.querySelector(selector);
    
    if (button) {
        button.classList.add('grey-out');
        setTimeout(() => {
            button.classList.remove('grey-out');
        }, 100);
    }
});

window.addEventListener('keyup', function (e) {
    let selector;
    
    if (e.code === "Enter") {
        selector = "[data-enter]";
    } else if (e.code === "Backspace") {
        selector = "[data-delete]";
    } else {
        selector = `[data-key='${e.key.toLowerCase()}']`;
    }

    let button = keyboard.querySelector(selector);
    if (button) {
        button.classList.remove('grey-out');
    }
});

function animateSquare(squareElement) {
    squareElement.classList.add('pulse');
  
    setTimeout(() => {
      squareElement.classList.remove('pulse');
    }, 200); // 200ms equals the duration of the animation
  }
  

function pressKey(key) {

    if (gameEnded && !customChallenge) return; // Stop the user from continuing to play after winning

    if (guess.length < 5) {
        guess += key;
        updateDisplay();
    }
}

function deleteChar() {
    if (guess.length > 0) {
        guess = guess.slice(0, -1);
        updateDisplay();
    }
}

// Needed to show letter entry animation
let previousDisplay = ["", "", "", "", ""];

function resetPreviousDisplay() {
    previousDisplay = ["", "", "", "", ""];
}

function updateDisplay() {
    let currentRow = rows[guesses].childNodes;
    
    for (let i = 0; i < 5; i++) {
        if (!currentRow[i].textContent && guess[i]) {
            currentRow[i].textContent = guess[i];
            currentRow[i].classList.add('pulse');
            
            // remove the pulse class after the animation ends
            setTimeout(() => {
                currentRow[i].classList.remove('pulse');
            }, 100);
        } else if (!guess[i]) {
            currentRow[i].textContent = "";
        }
    }
}




// Game Board
const gameBoard = document.getElementById('gameBoard');
const rows = document.getElementsByClassName("row");
const squares = document.getElementsByClassName("square");

function generateBoard(rowAmount, colAmount) {
    generateRows(rowAmount);
    generateColumns(rowAmount, colAmount);
}

function generateRows(rowAmount) {
    for (let i = 0; i < rowAmount; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.classList.add(`${i}`);
        gameBoard.appendChild(row);
    }
}

function generateColumns(rowAmount, colAmount) {
    for (let i = 0; i < rowAmount; i++) {
        for (let n = 0; n < colAmount; n++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add(n);
            rows[i].appendChild(square);
        }
    }
}


// Game logic
function isWordValid(word) {
    return fetch(`/api/isWordValid/${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => json.isValid)
    .catch((error) => {
      return false;
    });
}

function checkWord(guessedWord, generatedWord) {

    let result = Array.from({ length: generatedWord.length }, () => "grey");
    let guessedWordArray = [...guessedWord];
    let generatedWordArray = [...generatedWord];
    let tmpGeneratedWordArray = [...generatedWord];

    // Check greens
    for (let i = 0; i < guessedWordArray.length; i++) {
        if (guessedWordArray[i] === generatedWordArray[i]) {
            result[i] = "green";
            tmpGeneratedWordArray[i] = "#"; // Replace the correct character in tmpGeneratedWordArray with a placeholder
            guessedWordArray[i] = "@"; // Also replace the character in guessedWordArray to avoid counting it as yellow in the next step
        }
    }

    // Check yellows
    for (let i = 0; i < guessedWordArray.length; i++) {
        let indexInGenerated = tmpGeneratedWordArray.indexOf(guessedWordArray[i]);
        if (indexInGenerated !== -1) {
            // If the character is not already marked green
            if (result[i] !== "green") {
                result[i] = "yellow";
            }
            // Replace the character in tmpGeneratedWordArray with a placeholder to avoid counting it again
            tmpGeneratedWordArray[indexInGenerated] = "#";
        }
    }

    return result;
}


function colourGameboardSquares(result) {
    return new Promise((resolve) => {
        let currentRow = rows[guesses].childNodes;
        let animationsCompleted = 0;

        for (let i = 0; i < 5; i++) {
            const square = currentRow[i];
            square.textContent = guess[i];

            setTimeout(() => {
                square.style.borderStyle = "none";
                square.classList.add('flip-animate-instant');
                setTimeout(() => {
                    square.classList.remove('flip-animate-instant');
                    square.classList.add('flip-animate-slow');
                    square.addEventListener('animationend', function() {
                        square.classList.remove('flip-animate-slow');
                        animationsCompleted++;
                        if (animationsCompleted === 5) {
                            resolve();
                        }
                    }, { once: true });

                    if (result[i] === "green") {
                        square.style.backgroundColor = '#6aaa64';
                    }
                    if (result[i] === "yellow") {
                        square.style.backgroundColor = '#c9b458';
                    }
                    if (result[i] === "grey") {
                        square.style.backgroundColor = '#86888a';
                    }
                }, 40);
            }, i * 500);
        }
    });
}

function colourKeyboardKeys(result) {
    for (let i = 0; i < 5; i++) {
        const key = document.querySelector(`[data-key='${guess[i]}']`);

        colourKey(key, result[i])
    }
}

function colourKey(key, colour) {
    // If the key is already green, don’t change it
    if (key.classList.contains('key-green')) return;
    
    // If the key is already yellow, don’t change it to grey
    if (key.classList.contains('key-yellow') && colour === "grey") return;
    
    // Remove existing color classes
    key.classList.remove('key-grey', 'key-yellow', 'key-green');
    
    // Add the new color class
    if (colour === "green" || colour === "yellow" || colour === "grey") {
      key.classList.add(`key-${colour}`);
    }
}
  

async function submitGuess() {

    if (gameEnded) return;

    let currentRow = rows[guesses];

    // Check if guess length is 5
    if (guess.length !== 5) {
        showErrorTooltip("Not enough letters");
        applyJiggleAnimation(currentRow);
        return;
    }

    // This is relevant when reloading a completed daily game
    if (guesses > 5) {
        showResultsModal();
        return;
    };
    
    const validWord = await isWordValid(guess);
        
    if (!validWord) {
        showErrorTooltip("Not in word list");
        applyJiggleAnimation(currentRow);
        return;        
    }

    let result = checkWord(guess, generatedWord);
    gameBoardArray.push(result); // For exporting as emojis later
    
    await colourGameboardSquares(result);
    colourKeyboardKeys(result);  
    resetPreviousDisplay();

    guesses++;

    // If result is all green
    if (result.every(color => color === "green")) {

        applyJumpAnimation(currentRow);
        
        switch(guesses) {
            case 1: 
                resultText = "Genius!";
                break;
            case 2: 
                resultText= "Magnificent!";
                break;
            case 3: 
                resultText = "Impressive!";
                break;
            case 4: 
                resultText = "Splendid!";
                break;
            case 5: 
                resultText= "Great!";
                break;
            case 5: 
                resultText = "Phew!";
                break;
        }

        showResultTooltip(resultText);
        scores.push(guesses);
        gameEnd();

    } else if (guesses === 6) {
        showResultTooltip(generatedWord.toUpperCase());
        scores.push(0); // 0 represents a loss
        gameEnd();
    } else {
        guess = "";
    }
}

function gameEnd() {
    gameEnded = true;
    guess = "";

    updateStatsOnServer();
}

// User interface
function applyJumpAnimation(row) {
    
    const squares = row.querySelectorAll('.square');
    let delay = 0; // initial delay

    squares.forEach(square => {
        setTimeout(() => {
            square.classList.add('jump');
            square.addEventListener('animationend', () => {
                square.classList.remove('jump');
            }, { once: true });
        }, delay);
        delay += 100; // delay for next square
    });
}

// Tooltips
const tooltip = document.getElementById('tooltip');

// Result tooltip
function showResultTooltip(resultText) {

    // Assume tooltip is an element you have in your HTML to show the resultText
    tooltip.textContent = resultText;
    tooltip.style.display = 'block';

    // Hide tooltip after 2 seconds and show the modal
    setTimeout(function() {
        tooltip.style.display = 'none';
        showResultsModal();
    }, 2000);
}

// Errors
function showErrorTooltip(errorText) {
    tooltip.textContent = errorText;
    tooltip.style.display = 'block';
    setTimeout(() => tooltip.style.display = 'none', 2000); // Hide after 2 seconds

}
function applyJiggleAnimation(row) {
    row.classList.add('jiggle-animation');
    row.addEventListener('animationend', () => {
        row.classList.remove('jiggle-animation');
    }, { once: true });
}

// Stats
function updateStatsOnServer() {
if (userName) {
        fetch('/user/update-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username: userName, score: guesses }),
        })
        
        .then(response => {
            if (!response.ok) {
              return response.json().then(err => { throw err; });
            }
            return response.json();
          })
        .catch((error) => console.error('Error:', error));
}
}

function calculateCounts() {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    scores.forEach(score => counts[score] !== undefined && counts[score]++);
    return counts;
}

function calculateStats() {

    let wins = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let streakCount = 0;
    const totalGames = scores.length;

    scores.forEach(score => {
        if (score !== 0) {
            wins++;
            streakCount++;
            if (streakCount > maxStreak) maxStreak = streakCount;
        } else {
            streakCount = 0;
        }
    });

    const winPercentage = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) : 0;

    // Check if the last game is a loss and adjust currentStreak accordingly
    if (scores.length > 0 && scores[scores.length - 1] === 0) {
        currentStreak = 0;
    } else {
        currentStreak = streakCount;
    }

    return { winPercentage, currentStreak, maxStreak, totalGames };
}


function renderStats(counts, totalGames) {
    let maxAttempt;
    let maxCount = 0;

    for (const attempt in counts) {
        if (counts[attempt] > maxCount) {
            maxCount = counts[attempt];
            maxAttempt = attempt;
        }
    }

    for (const attempt in counts) {
        updateBarAndCount(attempt, counts[attempt], totalGames, attempt === maxAttempt);
    }
}

function updateBarAndCount(attempt, count, totalGames, isMax) {
    const countElem = document.getElementById(`${attempt}AttemptCountValue`);
    const barElem = document.getElementById(`${attempt}AttemptCountBar`);
    if (!countElem || !barElem) return;

    countElem.textContent = count;
    const percentage = ((count / totalGames) * 100) || 0;
    barElem.style.width = `${percentage}%`;
    isMax ? barElem.classList.add('maxValueBar') : barElem.classList.remove('maxValueBar');
}

function renderAdditionalStats(stats) {
    document.getElementById('statsPlayedValue').textContent = stats.totalGames;
    document.getElementById('statsWinPercentValue').textContent = `${stats.winPercentage}`;
    document.getElementById('statsCurrentStreakValue').textContent = stats.currentStreak;
    document.getElementById('statsMaxStreakValue').textContent = stats.maxStreak;
}



// Modals
function showResultsModal() {
    const resultsModalContent = document.querySelector("#resultsModalContent")

    const resultsFooter = document.querySelector('.results-footer');

    if (gameEnded) {
        resultsFooter.style.display = 'block';
    } else {
        resultsFooter.style.display = 'none';
    }

    try {
        const counts = calculateCounts();
        const stats = calculateStats();
        renderStats(counts, stats.totalGames);
        renderAdditionalStats(stats);
    } catch (err) {
        console.error('Error rendering stats:', err);
    }

    resultsModalContent.style.display = 'block';
    showModal();
}

function showHelpModal() {
    const helpModalContent = document.querySelector("#helpModalContent");
    helpModalContent.style.display = 'block';
    
    showModal();

    const tilesToAnimate = document.querySelectorAll('.animate');

    tilesToAnimate.forEach(tile => {
        tile.classList.add('flip-animate-instant');
        tile.addEventListener('animationend', function() {
            tile.classList.remove('flip-animate-instant');
            tile.classList.add('flip-animate-slow');
        }, { once: true });
    });
}


function showSettingsModal() {
    const settingsModalContent = document.querySelector("#settingsModalContent");
    settingsModalContent.style.display = 'block';

    showModal();
}

function showModal() {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.content');

    modal.style.display = 'flex';
    modal.classList.add('modal-bg-fade-in');
    modalContent.classList.add('modal-content-slide-up');
}

function hideModal() {
    const modal = document.getElementById('modal');

    const resultsModalContent = document.querySelector("#resultsModalContent")
    const helpModalContent = document.querySelector("#helpModalContent")

    resultsModalContent.style.display = 'none';
    helpModalContent.style.display = 'none';
    settingsModalContent.style.display = 'none';

    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const closeButton = modal.querySelector('.header button');

    // Close modal on close button click
    closeButton.addEventListener('click', hideModal);

    // Close modal on outside click
    window.addEventListener('click', function(event) {
        if(event.target === modal) {
            hideModal();
        }
    });

    // Close modal on Esc button press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideModal();
        }
    });

    // Go back to Landing page on title click
    const titleButton = document.getElementById('titleId');
    titleButton.addEventListener('click', function() {
        window.location.href = '/';
    });

    // Sharing results
    const shareButton = document.getElementById('shareButton');
    const shareMessage = document.getElementById('shareMessage');

    shareButton.addEventListener('click', function () {
        let resultsShare = shareResult();
        
        if (navigator.share) {
            navigator.share({
                title: 'SHWORDLE',
                text: resultsShare.shareString,
                url: resultsShare.shareLink
            }).catch((error) => console.error('Error sharing', error));
        } else { // If Web Share API is not available, copy to clipboard
            navigator.clipboard.writeText(`${resultsShare.shareString}${resultsShare.shareLink}`).then(() => {
                shareMessage.textContent = "Copied to clipboard"
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    });
});


// Share results
function shareResult() {

    // Convert boardArray to emojis
    let gameBoardExport = "";

    gameBoardArray.forEach(row => {
        let newRow = row.map(cell => {
            if(cell === "grey") return "⬛";
            if(cell === "yellow") return "🟨";
            if(cell === "green") return "🟩";
        }).join(''); // Join each modified 'cell' of a 'row' into a string

        gameBoardExport += newRow; // Append each 'row' string to 'gameBoardExport'
        gameBoardExport += '\n'; // Append a newline character after each 'row'
    });

    // Generate share link
    // let shareLink = "https://liamjshaw.github.io/shwordle/#";
    let shareLink = `${window.location}`;

    // Will need an endpoint for word encryption, or do it locally here
    // shareLink += encryptWord(generatedWord);


    // Compose share string
    let shareString = "Shwordle | "
    shareString += guesses 
    shareString += "/6";
    shareString += "\n\n";
    shareString += gameBoardExport;
    shareString += "\n";

    return { shareString, shareLink };
}


// Custom challenge
let userMessage;

async function generateLink() {

    // This is a workaround for the way guess is normally cleared
    // I've tried to do the custom challenge "in engine" so to speak
    // It's more work than it's worth to change that behaviour just for this
    let customWord = guess;

    try {
        const isValid = await isWordValid(customWord);

        if (isValid) {
            let row = document.querySelector(".row");
            let squares = row.querySelectorAll(".square");

            for (let i = 0; i < 5; i++) {
                squares[i].textContent = customWord[i];
                squares[i].style.backgroundColor = '#6aaa64';
                squares[i].style.borderStyle = "none";
            }

        const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
                          'n','o','p','q','r','s','t','u','v','w','x','y','z'];

        let encrypted = "/";
        
        encrypted += alphabet[(alphabet.indexOf(customWord[0]) + 14) % 26];
        encrypted += alphabet[(alphabet.indexOf(customWord[1]) + 15) % 26];
        encrypted += alphabet[(alphabet.indexOf(customWord[2]) + 16) % 26];
        encrypted += alphabet[(alphabet.indexOf(customWord[3]) + 17) % 26];
        encrypted += alphabet[(alphabet.indexOf(customWord[4]) + 18) % 26];

        // Generate share link
        let shareLink = window.location.host;
        shareLink += encrypted;

        // Copy share link to keyboard
        navigator.clipboard.writeText(shareLink);

        let countdownValue = 5;
        userMessage.textContent = "Share link copied to clipboard!";

        const countdownInterval = setInterval(() => {
            userMessage.innerHTML = `Share link copied to clipboard! Redirecting to home in ${countdownValue} seconds...`;
            countdownValue--;
        
            if (countdownValue < 0) {
                clearInterval(countdownInterval);
                window.location.href = "/"; // Redirect to home
            }
        }, 1000); 
        
        } else {
            userMessage.textContent = "Enter a valid word!";
            console.log("Enter a valid word!");
        }
    } catch (error) {
        console.error("Error validating word", error);
    }

 
}

function resetKeyboard() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.classList.remove('key-green', 'key-yellow', 'key-grey');
    });
}


function customChallengeMode() {

    customChallenge = true;

    guesses = 0;
    guess = "";
    gameBoardArray = []
    resetKeyboard();

    // Clear gameboard
    gameBoard.textContent = ''

    const customChallengeTitle = document.createElement("h2");
    customChallengeTitle.classList.add('customChallengeText');
    customChallengeTitle.textContent = "Custom Challenge";

    gameBoard.appendChild(customChallengeTitle);

    const customChallengeText1 = document.createElement("p");
    customChallengeText1.classList.add('customChallengeText');
    customChallengeText1.innerHTML = `Type a valid word and press Enter`

    const customChallengeText2 = document.createElement("p");
    customChallengeText2.classList.add('customChallengeText');
    customChallengeText2.innerHTML = `A link will be copied to your clipboard so you can share your custom challenge!`

    gameBoard.appendChild(customChallengeText1);
    gameBoard.appendChild(customChallengeText2);

    generateRows(1);
    generateColumns(1, 5);

    userMessage = document.createElement("h4");
    userMessage.classList.add('customChallengeText');

    gameBoard.appendChild(userMessage);
}
