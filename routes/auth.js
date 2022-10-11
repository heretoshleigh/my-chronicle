const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const User = require('../models/User')

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

// // @desc    Get signup page
// // @route   GET /signup
router.get('/signup', ensureGuest, (req, res) => {
  res.render('user/signup', {
    layout: 'login',
  })
})

// // @desc    Create local account
// // @route   POST /auth/signup
router.post('/signup', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('user/signup', {
      layout: 'login',
      errors,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    });
  } else {
    User.findOne({ email: email.toLowerCase() }).then(user => {
      if (user) {
        errors.push({ msg: `An account already exists for ${email}` });
        res.render('user/signup', {
          layout: 'login',
          errors,
          firstName,
          lastName,
          email,
          password,
          confirmPassword
        });
      } else {
        const newUser = new User({
          displayName: firstName,
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Registration complete! Please log in.'
                );
                res.redirect('../login/local');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
})

// // @desc    Get local login page
// // @route   GET /auth/local
router.get('/local', ensureGuest, (req, res) => {
  res.render('user/login-local', {
    layout: 'login',
  })
})

// @desc    Auth with Local
// @route   GET /auth/local
router.post('/local', (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect("../login/local");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect(req.session.returnTo || "/dashboard");
    });
  })(req, res, next);
})

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log('User has logged out.');
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect("/");
    });
  });
});

module.exports = router
