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

describe('checkWord', () => {

    // User guess then game word

    it('should mark letters that are correct and in the correct position as "green"', () => {
      const result = checkWord('WEARY', 'WHISK');
      expect(result).toEqual(['green', 'grey', 'grey', 'grey', 'grey']);
    });

    it('should mark all letters that are correct and in the correct position as "green"', () => {
        const result = checkWord('ALARM', 'ALARM');
        expect(result).toEqual(['green', 'green', 'green', 'green', 'green']);
      });
    
    it('should mark letters that are correct but in the wrong position as "yellow"', () => {
      const result = checkWord('INTEL', 'PILLS');
      expect(result).toEqual(['yellow', 'grey', 'grey', 'grey', 'yellow']);
    });
    
    it('should mark letters that are not in the word at all as "grey"', () => {
      const result = checkWord('BENCH', 'ALARM');
      expect(result).toEqual(['grey', 'grey', 'grey', 'grey', 'grey']);
    });
  
    it('should only mark the same number of occurrences of letters as "yellow" as they appear in the generated word', () => {
      const result = checkWord('ALARM', 'LABEL');
      expect(result).toEqual(['yellow', 'yellow', 'grey', 'grey', 'grey']);
    });
  
  });
  