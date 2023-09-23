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
    console.log('Inside createUser method'); // Log to see if method is entered
    const errors = validationResult(req);
    console.log('Validation Result: ', errors.array()); // Log validation results
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
      console.log('Error Occurred: ', err); // Log the error object
      if (err.code === 11000) { // MongoDB duplicate key error code
        // Render the signup page with a relevant error message
        return res.status(400).render('signup', {
          errors: [{ msg: 'Username is already taken' }],
        });
      }

      next(err);
    }
};
