const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.getSignupPage = (req, res) => {
    res.render('signup', { errors: [] });
  };
  
  exports.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signup', { errors: errors.array() });
    }  

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username.toLowerCase(),
        password: hashedPassword,
      });
      await user.save();
      res.redirect('/play');
    } catch (err) {
      if (err.code === 11000) { // MongoDB duplicate key error code
        // Render the signup page with a relevant error message
        return res.status(400).render('signup', {
          errors: [{ msg: 'Username is already taken' }],
        });
      }

      next(err);
    }
};
