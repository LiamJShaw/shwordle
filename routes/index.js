var express = require('express');
var router = express.Router();

const gameController = require("../controllers/gameController");

const today  = new Date();
const titleDate = today.toLocaleDateString('en-GB', 
{ year: 'numeric', month: 'numeric', day: 'numeric' });

const pageDate = today.toLocaleDateString('en-US', 
{ year: 'numeric', month: 'long', day: 'numeric' });

// Landing page
router.get('/', function(req, res, next) {
  res.render('index', { title: `SHWORDLE | ${titleDate}`, date: pageDate });
});

// Daily game
router.get('/play', function(req, res) {
  // const today = new Date();
  // const dateString = today.toISOString().slice(0,10); // format: YYYY-MM-DD
  // Get today's word from array based on date from beginning
  word = gameController.getDailyWord();

  res.render('game', { word: word });
});

// router.get('/:word([a-zA-Z]{5})', function(req, res) {
//   let word;
//   if(req.params.word) {
//       // if a word parameter is provided in the URL, decrypt it
//       // word = decryptWord(req.params.word); 
//       // check if the word is valid
//       const wordValid = gameController.isWordValid(req.params.word);

//       console.log(wordValid);

//       if (wordValid) {
//         word = req.params.word;
//       }

//       if (!wordValid) {
//         res.status(400).render('error', { message: 'Invalid word!' });
//         return;
//       }      

//       // What if it isn't valid? 
//       // Offer the error message, and the chance to play a random word?
//   } else {
//       // if no word parameter is provided, generate a random word
//       // word = getRandomWord(); 
//       word = "TESTE";
//   }

//   // res.render('game', { backendWord: word });
// });

// Custom game
router.get('/:word([a-zA-Z]{5})', function(req, res) {
    let word;
    if(req.params.word) {

      // if a word parameter is provided in the URL, decrypt it
      decryptedWord = gameController.decryptWord(req.params.word); 

      const wordValid = gameController.isWordValid(decryptedWord);

      if (wordValid) {
        word = decryptedWord;
      }

      // If word is not valid, you must send a response here
      if (!wordValid) {
        res.status(400).send('Invalid Word');
        return;
      }
    }

    res.render('game', { word: word });
});

// Word validator
router.get('/api/isWordValid/:word', function(req, res) {
  try {
    const word = req.params.word;
    const isValid = gameController.isWordValid(word);
    res.json({ isValid: isValid });
  } catch (error) {
    console.error('Error occurred: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;