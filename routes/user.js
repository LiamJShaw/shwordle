const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const userController = require('../controllers/userController');

// Sign up
router.get('/signup', userController.getSignupPage);

router.post('/signup',
  [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long')
      .matches(/^\S*$/).withMessage('Username cannot contain spaces'),
    body('password')
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('confirmpassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ],
  userController.createUser
);

// Log in
router.get('/login', (req, res) => {
  res.render('login', { errors: [] });
});

router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, re-render the login page with error messages.
      return res.status(422).render('login', { errors: errors.array() });
    }
    next();
  },
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err); // handle internal server error
      if (!user) {
        // Authentication failed
        return res.status(401).render('login', { errors: [{ msg: 'Invalid username or password' }] });
      }
      req.logIn(user, (err) => {
        if (err) return next(err); // handle internal server error
        return res.redirect('/'); // Successfully authenticated
      });
    })(req, res, next);
  }
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


// Stats
router.post('/update-score', async (req, res) => {
  try {
    const { username, score } = req.body;

    if (!username || score == null) {
      return res.status(400).json({ error: 'Username and score are required. Please log in.' });
    }

    console.log('Updating user:', username, 'with score:', score);

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $push: { scores: score } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser); // Send the updated user document as a response
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


module.exports = router;


