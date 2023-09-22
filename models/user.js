const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    scores: { type: Array, required: false}
  });
  
  UserSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

  module.exports = mongoose.model("User", UserSchema)