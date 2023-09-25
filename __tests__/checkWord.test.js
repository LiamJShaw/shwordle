const { checkWord } = require('../isolated_functions/checkWord.js'); 

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
  