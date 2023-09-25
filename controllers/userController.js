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
  try {
    // 1. Perform validation checks
    const errors = validationResult(req);

    // 2. Check if a user with the given username already exists
    const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
    if (existingUser) {
      errors.errors.unshift({ msg: 'Username is already taken' });
    }

    // 3. If there are any errors, render them
    if (!errors.isEmpty()) {
      return res.status(400).render('signup', { errors: errors.array() });
    }

    // 4. If no errors, create the user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username.toLowerCase(),
      password: hashedPassword,
    });
    await user.save();

    // Log the user in
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