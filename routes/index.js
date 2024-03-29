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
  console.log('Rendering index');
  try {
    res.render('index', { title: `SHWORDLE | ${titleDate}`, date: pageDate, user: req.user }, (err, html) => {
      if (err) {
        console.error('Render Error:', err);
        return res.status(500).send('Error rendering view');
      }
      res.send(html);
    });
  } catch (error) {
    console.error('Error in Route:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/play', function(req, res) {
  word = gameController.getDailyWord();

  let userScores = [];
  let userName;

  if (req.isAuthenticated()) {
      userScores = req.user.scores;
      userName = req.user.username;
  }

  res.render('game', { 
    word: word, 
    userScores: userScores || [],
    userName: userName || null
  });
  
});

// Random game
router.get('/random', function(req, res) {
  word = gameController.generateRandomWord();

  console.log(word);

  let userScores = [];
  let userName;

  if (req.isAuthenticated()) {
      userScores = req.user.scores;
      userName = req.user.username;
  }

  res.render('game', { 
    word: word, 
    userScores: userScores || [],
    userName: userName || null
  });
  
});

// Custom game
router.get('/:word([a-zA-Z]{5})', function(req, res) {
  let word;
  if(req.params.word) {

      decryptedWord = gameController.decryptWord(req.params.word); 
      const wordValid = gameController.isWordValid(decryptedWord);

      if (wordValid) {
          word = decryptedWord;
      } else {
          // Render the Invalid Word view if the word is not valid
          res.status(400).render('invalidWord');
          return;
      }
  }

  let userScores = [];
  let userName;

  if (req.isAuthenticated()) {
      userScores = req.user.scores;
      userName = req.user.username;
  }
  
  res.render('game', { 
    word: word, 
    userScores: userScores || [],
    userName: userName || null
  });
   
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