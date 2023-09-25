const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.getSignupPage = (req, res) => {
  res.render('signup', { errors: req.flash('errors') });
};
  
exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
    if (existingUser) {
      errors.errors.push({ msg: 'Username is already taken' });
    }

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array()); // Storing errors in flash to survive the redirect
      return res.redirect('/user/signup'); // Redirect back to the signup page
    }

    // No errors, proceed with user creation...
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username.toLowerCase(),
      password: hashedPassword,
    });
    await user.save();

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });

  } catch (err) {
    return next(err);
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