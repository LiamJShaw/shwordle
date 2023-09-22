function checkWord(guessedWord, generatedWord){

    let result = ["grey", "grey", "grey", "grey", "grey"];

    // convert strings to arrays for easier manipulation
    let guessedWordArray = [...guessedWord];
    let generatedWordArray = [...generatedWord];
    let tmpGeneratedWordArray = [...generatedWord]; 

    console.log(tmpGeneratedWordArray);

    for(let i = 0; i < guessedWordArray.length; i++){
            
        // If letter is in correct place
        if (guessedWordArray[i] === generatedWordArray[i]) {
            result[i] = "green";

            // Remove the characters so they can't be counted twice  
            tmpGeneratedWordArray[i] = "#";
            guessedWordArray[i] = "@";
        }
    }

    for(let i = 0; i < guessedWordArray.length; i++){

        // If letter is in word but wrong place
        if (tmpGeneratedWordArray.includes(guessedWordArray[i])) {
            result[i] = "yellow";

            // Only colour amount of yellows that are in word
            tmpGeneratedWordArray[i] = "$";
        }
    }
    
    return result;
}

console.log(checkWord("ELUDE", "TESTE"));

console.log(checkWord("ABCAE", "AAADA"));