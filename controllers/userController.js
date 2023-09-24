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
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return next(err); // or handle the error as you see fit
        }
        // Redirect the user to the landing page or wherever you see fit
        return res.redirect('/');
      });
      
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


// Stats
// userController.js
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const stats = calculateStats(user.scores);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

function calculateStats(scores) {
  // Initialize counts
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  scores.forEach(score => {
    if (counts[score] !== undefined) counts[score]++;
  });
  const totalGames = scores.length;
  return {
    counts,
    totalGames
  };
}