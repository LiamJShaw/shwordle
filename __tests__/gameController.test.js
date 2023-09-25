const supertest = require('supertest');
const seedrandom = require('seedrandom');

const app = require('../app');

const gameController = require('../controllers/gameController');

jest.mock('seedrandom');

describe('Game Controller', () => {
  describe('getDailyWord', () => {
    it('should return a word from wordListArray based on the date seed', () => {
      const mockSeedrandom = jest.fn(() => () => 0.5);
      seedrandom.mockImplementation(mockSeedrandom);
      
      const result = gameController.getDailyWord();
      
      expect(gameController.isWordValid(result)).toBe(true);
      expect(mockSeedrandom).toHaveBeenCalledWith(new Date().toISOString().split('T')[0]);
    });
  });

  describe('generateRandomWord', () => {
    it('should return a random word from wordListArray', () => {
      const result = gameController.generateRandomWord();
      console.log("Random word", result);
      
      expect(gameController.isWordValid(result)).toBe(true);
    });
  });

  describe('isWordValid', () => {
    it('should return true if word is in the allowedListArray or wordListArray', () => {
      expect(gameController.isWordValid('apple')).toBe(true);
      expect(gameController.isWordValid('satan')).toBe(true);
      expect(gameController.isWordValid('cromulent')).toBe(false);
      expect(gameController.isWordValid('embiggens')).toBe(false);
    });
  });

  describe('Encrypt and Decrypt', () => {
    it('should correctly encrypt and then decrypt a word', () => {
      const word = 'apple';
      const encrypted = gameController.encryptWord(word);
      const decrypted = gameController.decryptWord(encrypted);
      
      expect(decrypted).toBe(word);
    });

    test('GET /ujujk (a valid encrypted custom word) should return status 200', async () => {
        const response = await supertest(app).get('/ujujk');
        
        expect(response.statusCode).toBe(200);
    });
    
    test('GET /hwitv (an invalid encrypted custom word) should return status 400', async () => {
        const response = await supertest(app).get('/hwitv');
        
        expect(response.statusCode).toBe(400);
    });
  });

  describe('Word Validator Route', () => {
    test('GET /api/isWordValid/:word should return valid JSON', async () => {
        const response = await supertest(app).get('/api/isWordValid/cromulent');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('isValid');
    });

    test('GET /api/isWordValid/:word should handle errors gracefully', async () => {
        // Spy on the isWordValid method and mock its implementation to throw an error
        const isWordValidSpy = jest.spyOn(gameController, 'isWordValid');
        isWordValidSpy.mockImplementation(() => {
            throw new Error('Mock Error');
        });
        
        const response = await supertest(app).get('/api/isWordValid/someWord');
        
        expect(response.statusCode).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Internal Server Error');
        
        // Restore the original implementation after the test
        isWordValidSpy.mockRestore();
    });
});

});
