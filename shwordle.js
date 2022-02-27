const fs = require("fs");

// Set up game words
const wordList = fs.readFileSync("./wordlist.txt").toString('utf-8');
const wordListArray = wordList.split("\n")

// Set up allowed words
const allowedList = fs.readFileSync("./allowedwords.txt").toString('utf-8');
const allowedListArray = allowedList.split("\n")

let generatedWord = generateWord();

function generateWord(){
    const random = Math.floor(Math.random() * (wordListArray.length-1));    
    return wordListArray[random];
}

function isWordValid(word){
    if (allowedList.includes(word)) {
        return true;
    }
    
    return false;
}

function setCharAt(str, index, char) {
    if(index > str.length-1) return str;

    return str.substring(0, index) + char + str.substring(index+1);
}

function checkWord(word){

    if (word === generatedWord) return true;

    let result = "00000";
    let tmpGeneratedWord = generatedWord;

    for(let i= 0; i < 5; i++){
            
        // If letter is in correct place
        if (word.charAt(i) === generatedWord.charAt(i)){
            result = setCharAt(result, i, "2");

            // Removes the characters so they can't be counted twice  
            tmpGeneratedWord = setCharAt(tmpGeneratedWord, i, "#");  
            word = setCharAt(word, i, "@");  
        }
    }

    // console.log("Greens: Guessed word: " + word);
    // console.log("Greens: Generated Word: " + tmpGeneratedWord);

    for(let i= 0; i < 5; i++){

        // If letter is in word but wrong place
        if (tmpGeneratedWord.includes(word.charAt(i))){
            result = setCharAt(result, i, "1");
            // todo: Only colour amount of yellows that are in word 
        }
    }

    // console.log("Yellows: Guessed word: " + word);
    // console.log("Yellows: Generated Word: " + tmpGeneratedWord);

        return result;
}

