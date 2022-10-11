const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: function() { return !this.email },
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: function() { return !this.googleId },
  },
  password: {
    type: String,
    function() { return !this.googleId },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Helper method for validating user's password
UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema)
