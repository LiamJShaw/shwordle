// Initialise game
let guess = "";
let guesses = 0;
let generatedWord;
let gameBoardArray = [];


document.addEventListener('DOMContentLoaded', function() {
    generatedWord = backendWord;
    generateBoard(6, 5);

    console.log(backendWord);
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
        submitGuess();
    }

    if (key === "Backspace") {
        deleteChar(); 
    }
    
})

const keyboard = document.querySelector(".keyboard");
keyboard.addEventListener("click", handleMouseClick);

function handleMouseClick(e) {
    if (e.target.matches("[data-enter]")) {
        submitGuess();
    }

    if (e.target.matches("[data-key]")) {
        let keyElement = e.target;
        keyElement.classList.add('grey-out');
        setTimeout(() => {
            keyElement.classList.remove('grey-out');
        }, 100); // 100ms or adjust as needed
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
        }, 100); // 100ms or adjust as needed
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



function pressKey(key) {
    if (guess.length < 5) {
        guess += key;
        updateDisplay();
    }
}

function deleteChar() {
    guess = guess.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    let currentRow = rows[guesses].childNodes;

    for (let i = 0; i < 5; i++) {
        currentRow[i].textContent = "";
    }
    
    for (let i = 0; i < guess.length; i++) {
        currentRow[i].textContent = guess[i];
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
      console.error('Fetch error: ', error);
      return false; // Return false if an error occurs
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
            }, i * 600);
        }
    });
}

function colourKeyboardKeys(result) {
    for (let i = 0; i < 5; i++) {
        const key = document.querySelector(`[data-key='${guess[i]}']`);

        colourKey(key, result[i])
    }
}

async function submitGuess() {

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

    guesses++;

    // If result is all green
    if (result.every(color => color === "green")) {
        
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

    } else if (guesses === 6) {
        showResultTooltip(generatedWord.toUpperCase());
    } else {
        guess = "";
    }
}

// User interface
function colourKey(key, colour) {

    let green = "#6aaa64"; 
    let yellow = "#c9b458"; 
    let grey = "#363636" 

    // Green
    if (colour === "green") {
        key.style.backgroundColor = green;
        return;
    }

    // Yellow
    if (colour === "yellow") {

        if (key.style.backgroundColor == green) {
            return;
        }

        key.style.backgroundColor = yellow;
        return;
    }

    // Grey
    if (colour === "grey") {

        if (key.style.backgroundColor == green || key.style.backgroundColor == yellow) {
            return;
        }

        key.style.backgroundColor = grey;
        return;
    }
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

// Results Modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    const closeButton = document.getElementById('closeButton');
    const shareButton = document.getElementById('shareButton');

    // Close modal on close button click
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', function(event) {
        if(event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Event listener for share button
    shareButton.addEventListener('click', function () {
        console.log("Share button clicked");
    });
});

function showResultsModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}