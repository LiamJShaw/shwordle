const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const userController = require('../controllers/userController');

router.get('/signup', userController.getSignupPage);

router.post('/signup',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('confirmpassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ],
  userController.createUser
);

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
        return res.redirect('/play'); // Successfully authenticated
      });
    })(req, res, next);
  }
);


router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;