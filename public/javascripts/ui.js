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

window.addEventListener('keydown', function (e) {
    let key = e.key.toLowerCase();
    let button = keyboard.querySelector(`[data-key='${key}']`);
    if (button) {
        button.classList.add('grey-out');
        setTimeout(() => {
            button.classList.remove('grey-out');
        }, 100); // 100ms or adjust as needed
    }
});

window.addEventListener('keyup', function (e) {
    let key = e.key.toLowerCase();
    let button = keyboard.querySelector(`[data-key='${key}']`);
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
    fetch(`/api/isWordValid/${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      if (!json.isValid) {
        // Tell user word is invalid
        console.error('Word is invalid!');
        return false;
      } else {
        // Continue with valid word
        console.log('Word is valid!');
        return true;
      }
    })
    .catch((error) => console.error('Fetch error: ', error));
}

function checkWord(guessedWord, generatedWord){

    let result = "00000";
    let tmpGeneratedWord = generatedWord;

    for(let i= 0; i < 5; i++){
            
        // If letter is in correct place
        if (guessedWord.charAt(i) === generatedWord.charAt(i)){
            result = setCharAt(result, i, "2");

            // Removes the characters so they can't be counted twice  
            tmpGeneratedWord = setCharAt(tmpGeneratedWord, i, "#");  
            guessedWord = setCharAt(guessedWord, i, "@");  
        }
    }

    for(let i= 0; i < 5; i++){

        // If letter is in word but wrong place
        if (tmpGeneratedWord.includes(guessedWord.charAt(i))){
            result = setCharAt(result, i, "1");

            // Only colour amount of yellows that are in word
            tmpGeneratedWord = setCharAt(tmpGeneratedWord, tmpGeneratedWord.indexOf(guessedWord.charAt(i)), "$");
        }
    }
    
    return result;
}

function submitGuess() {

    console.log(generatedWord);

    if (guesses > 5) {
        showResultsModal();
        return;
    };

    let currentRow = rows[guesses].childNodes

    console.log(isWordValid(guess));

    if (!isWordValid(guess)) {
        // Tell user word is invalid
        return;        
    }

    guesses++;
    
    let result = checkWord(guess, generatedWord);
    gameBoardArray.push(result); // For exporting as emojis later
    
    for (let i = 0; i < 5; i++) {
        const square = currentRow[i];
        const key = document.querySelector(`[data-key='${guess[i]}']`);
    
        square.textContent = guess[i];
    
        setTimeout(() => {
            square.style.borderStyle = "none";
            square.classList.add('flip-animate-instant');
            setTimeout(() => {
                square.classList.remove('flip-animate-instant');
                square.classList.add('flip-animate-slow');
                square.addEventListener('animationend', function() {
                    square.classList.remove('flip-animate-slow');
                }, { once: true });
    
                if (result[i] === "2") {
                    square.style.backgroundColor = '#6aaa64';
                    colourKey(key, "green");
                }
                if (result[i] === "1") {
                    square.style.backgroundColor = '#c9b458';
                    colourKey(key, "yellow");
                }
                if (result[i] === "0") {
                    square.style.backgroundColor = '#86888a';
                    colourKey(key, "grey");
                }
            }, 40);
        }, i * 660);
    }    

    if (result === "22222") {
        
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

        showTooltip(resultText);
    }

    if (guesses === 6 && result != "22222") { 
        // showWord.textContent = "Word: " + generatedWord.toUpperCase()
        showTooltip(generatedWord.toUpperCase());
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

// Result tooltip
function showTooltip(resultText) {

    // Assume tooltip is an element you have in your HTML to show the resultText
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = resultText;
    tooltip.style.display = 'block';

    // Hide tooltip after 3 seconds and show the modal
    setTimeout(function() {
        tooltip.style.display = 'none';
        showResultsModal();
    }, 2000);
}

// Modal
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

// Function to Show Modal
function showResultsModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

// Functions I'd ideally like rid of!
function setCharAt(str, index, char) {
    if(index > str.length-1) return str;

    return str.substring(0, index) + char + str.substring(index+1);
}