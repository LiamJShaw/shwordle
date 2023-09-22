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

router.get('/login', userController.getLoginPage);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/user/login' }),
  (req, res) => {
    res.redirect('/play');
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