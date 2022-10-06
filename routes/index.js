const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('landing', {
    layout: 'landing',
  })
})

// // @desc    About page
// // @route   GET /about
router.get('/about', ensureGuest, (req, res) => {
  res.render('about', {
    layout: 'landing',
  })
})

// // @desc    Login page
// // @route   GET /login
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    // const records = await Record.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      stories,
      // records,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
