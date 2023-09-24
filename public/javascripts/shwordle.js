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

document.addEventListener('DOMContentLoaded', function() {
    newGame();
    generateBoard(6, 5);
});

function updateDisplay() {

    let currentRow = rows[guesses].childNodes;

    for (let i = 0; i < 5; i++) {
        currentRow[i].textContent = "";
    }
    
    for (let i = 0; i < guess.length; i++) {
        currentRow[i].textContent = guess[i];
    }
}

let guess = "";
let guesses = 0;
let generatedWord;

function newGame(){

    customChallenge = false;
    
    // Clear everything from previous games
    guess = "";
    gameBoardArray = []
    resetKeyboard();
    clearBoard();
    // resultMessage.textContent = "";
    // showWord.textContent = ""

    // Clear previous chosen word
    let urlParameter = "";

    urlParameter = checkURL();

    if (!urlParameter) {
        generatedWord = generateWord();
        
    } else {
        generatedWord = decryptWord(urlParameter);
        // Remove the urlParameter from the URL so it isn't reused
        window.history.pushState("#" + urlParameter, "Shwordle", "/shwordle");
    }

    guesses = 0;

    console.log("Answer: " + generatedWord);
}

function clearBoard() {
    // Apparently faster than setting innerHTML to ""
    gameBoard.textContent = ''
}

// Keyboard input
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
        console.log(e.target.dataset.key);
        pressKey(e.target.dataset.key);
    }

    if (e.target.matches("[data-delete]")) {
        // backspace
        deleteChar(); 
    }
}

// Enter code separate from the others so it can 
// be easily reused for issuing a challenge
const enterButton = document.querySelector("[data-enter");

// Can't remove event listener without turning my arrow function to a named one
function submitGuess() {
    game(guess);
    guess = "";
}

const titleButton = document.querySelector(".title");

titleButton.addEventListener("click", () => {
    newGame();
})

gameBoard.addEventListener("click", () => {
    const random = Math.floor(Math.random() * (allowedListArray.length-1));    
    guess = allowedListArray[random];
    submitGuess();
})

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


const modal = document.querySelector(".modal");
const resultMessage = document.querySelector(".resultMessage");
const showWord = document.querySelector(".word");

function game(guess) {

    if (guesses > 5) return;

    let currentRow = rows[guesses].childNodes

    if (!isWordValid(guess)) {
        // Tell user word is invalid
        return;        
    }

    guesses++;
    
    let result = checkWord(guess, generatedWord);
    gameBoardArray.push(result); // For exporting as emojis later
    
    for (let i = 0; i < 5; i++) {

        const key = document.querySelector(`[data-key='${guess[i]}']`);

        currentRow[i].textContent = guess[i];
        currentRow[i].style.borderStyle = "none";

        if (result[i] === "2") {
            currentRow[i].style.backgroundColor = '#6aaa64';
            colourKey(key, "green");
;        }
        if (result[i] === "1") {
            currentRow[i].style.backgroundColor = '#c9b458';
            colourKey(key, "yellow");
        }
        if (result[i] === "0") {
            currentRow[i].style.backgroundColor = '#939598'; 
            colourKey(key, "grey");
        }        
      }

    if (result === "22222") {
        
        switch(guesses) {
            case 1: 
                resultMessage.textContent = "Genius!";
                break;
            case 2: 
                resultMessage.textContent = "Magnificent!";
                break;
            case 3: 
                resultMessage.textContent = "Impressive!";
                break;
            case 4: 
                resultMessage.textContent = "Splendid!";
                break;
            case 5: 
                resultMessage.textContent = "Great!";
                break;
            case 5: 
                resultMessage.textContent = "Phew!";
                break;
        }
        
        modal.style.visibility = "visible";
    } 

    if (guesses === 6 && result != "22222") { 
        resultMessage.textContent = "Unlucky!";
        showWord.textContent = "Word: " + generatedWord.toUpperCase()
        modal.style.visibility = "visible";
    } else {
        guess = "";
    }
}

function colourKey(key, colour) {

    // Green
    if (colour === "green") {
        key.style.backgroundColor = "rgb(106, 170, 100)"
        return;
    }

    // Yellow
    if (colour === "yellow") {

        if (key.style.backgroundColor == "rgb(106, 170, 100)") {
            return;
        }

        key.style.backgroundColor = "rgb(201, 180, 88)";
        return;
    }

    // Grey
    if (colour === "grey") {

        if (key.style.backgroundColor == "rgb(106, 170, 100)") {
            return;
        }

        if (key.style.backgroundColor == "rgb(201, 180, 88)") {
            return;
        }

        key.style.backgroundColor = 'red';
        return;
    }
}


let gameBoardArray = [];

function generateWord() {
    const random = Math.floor(Math.random() * (wordListArray.length-1));    
    return wordListArray[random];
}

function isWordValid(word) {

    // For some reason, the official word lists I used have a 
    // problem where the guessable words aren't in the allowed list
    if (allowedListArray.includes(word.toLowerCase())) return true;
    if (wordListArray.includes(word.toLowerCase())) return true;

    return false;
}

function setCharAt(str, index, char) {
    if(index > str.length-1) return str;

    return str.substring(0, index) + char + str.substring(index+1);
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

function checkURL() { 

    const urlParameter = window.location.hash;

    if (urlParameter === "") {
        return false;
    }

    // Remove hash character
    return urlParameter.substring(1, 6);
}

function encryptWord(word) {
    
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z'];

    let encrypted = "";

    encrypted += alphabet[(alphabet.indexOf(word[0]) + 14) % 26];
    encrypted += alphabet[(alphabet.indexOf(word[1]) + 15) % 26];
    encrypted += alphabet[(alphabet.indexOf(word[2]) + 16) % 26];
    encrypted += alphabet[(alphabet.indexOf(word[3]) + 17) % 26];
    encrypted += alphabet[(alphabet.indexOf(word[4]) + 18) % 26];

    console.log(encrypted);

    return encrypted;
}

function decryptWord(word) {
    
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z'];

    let decrypted = "";

    decrypted += alphabet[(alphabet.indexOf(word[0]) + 12) % 26];
    decrypted += alphabet[(alphabet.indexOf(word[1]) + 11) % 26];
    decrypted += alphabet[(alphabet.indexOf(word[2]) + 10) % 26];
    decrypted += alphabet[(alphabet.indexOf(word[3]) + 9) % 26];
    decrypted += alphabet[(alphabet.indexOf(word[4]) + 8) % 26];

    return decrypted;
}

const modalMessage = document.querySelector(".message");
const shareButton = document.querySelector('.shareButton');

shareButton.addEventListener('click', () => {

    let resultString = shareResult();

    console.log(resultString);
        
    // Copy to clipboard
    navigator.clipboard.writeText(resultString);
    modalMessage.textContent = "Copied to clipboard"
})

function shareResult() {

    // Convert boardArray to emojis
    let gameBoardExport = "";

    gameBoardArray.forEach(row => {
        row = row.replaceAll("0", "⬛")
        row = row.replaceAll("1", "🟨")
        row = row.replaceAll("2", "🟩")

        gameBoardExport += row;
        gameBoardExport += '\n';
    })

    // Generate share link
    // let shareLink = "https://liamjshaw.github.io/shwordle/#";
    let shareLink = `${window.location}#`;

    shareLink += encryptWord(generatedWord);


    // Compose share string
    let shareString = "Shwordle | "
    shareString += guesses 
    shareString += "/6";
    shareString += "\n\n";
    shareString += gameBoardExport;
    shareString += "\n";
    shareString += shareLink;

    return shareString;
}

const newGameButton = document.querySelector(".newWord");

newGameButton.addEventListener("click", () => {
    modal.style.visibility = "hidden";
    resetKeyboard();

    // Remove the urlParameter from the URL so it isn't reused
    window.history.pushState("#" + checkURL(), "Shwordle", "/shwordle/");

    newGame();

    // Take the focus away from self to avoid accidentally restarting the game with enter
    enterButton.focus();
})

function resetKeyboard() {
    const keys = document.querySelectorAll(".key");

    keys.forEach(key => {
        key.style.backgroundColor = 'grey';
    })
}

// Custom challenge //

const customChallengeButton = document.querySelector(".customChallenge");

customChallengeButton.addEventListener("click", () => {

    guesses = 0;
    guess = "";
    gameBoardArray = []
    resetKeyboard();
    clearBoard();

    const customChallengeTitle = document.createElement("h1");
    customChallengeTitle.classList.add('.customChallengeText');
    customChallengeTitle.textContent = "Custom Challenge";
    customChallengeTitle.style.textAlign = "center";
    customChallengeTitle.style.margin = "1rem";
    customChallengeTitle.style.padding = "1rem";

    gameBoard.appendChild(customChallengeTitle);

    const customChallengeText = document.createElement("h3");
    customChallengeText.classList.add('.customChallengeText');
    customChallengeText.textContent = "Enter a valid 5 letter word and then hit enter to copy a link to your clipboard to challenge someone to find it"
    customChallengeText.style.textAlign = "center";
    customChallengeText.style.margin = "1rem";
    customChallengeText.style.padding = "1rem";

    gameBoard.appendChild(customChallengeText);

    generateRows(1);
    generateColumns(1);

    messageToUser = document.createElement("h4");
    messageToUser.classList.add('.customChallengeText');
    messageToUser.style.textAlign = "center";
    messageToUser.style.margin = "1rem";
    messageToUser.style.padding = "1rem";

    gameBoard.appendChild(messageToUser);

    // Replace Enter event listener with one specific to this
    console.log(enterButton);
    enterButton.removeEventListener("click", submitGuess);
    console.log(enterButton);
    enterButton.addEventListener("click", generateLink);

})

// I'm sorry. I will find a better way to do this.
let messageToUser;

function generateLink() {
        
    if (isWordValid(guess)) {
        let currentRow = rows[guesses].childNodes;

        for (let i = 0; i < 5; i++) {
            currentRow[i].style.backgroundColor = '#6aaa64';
            currentRow[i].style.borderStyle = "none";
        }

        // Generate share link
        let shareLink = "https://liamjshaw.github.io/shwordle/#";
        shareLink += encryptWord(guess);

        // Copy share link to keyboard
        navigator.clipboard.writeText(shareLink);
        modalMessage.textContent = "Copied to clipboard"

        messageToUser.textContent = "Share link copied to clipboard"
        const timeout = setTimeout(newGame, 3000);
    } else {
        messageToUser.textContent = "Enter a valid word!";
    }
}



// Evil Shwordle

// Map all the words that don't include any letters from guess
// if no words, map any that only have one letter
// keep going until the 6th guess where they either:
//      Guess the word that was just generated
//      They get it wrong and you just display the result as normal
