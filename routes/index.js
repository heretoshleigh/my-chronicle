const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Chronicle = require('../models/Chronicle')
const Record = require('../models/Record')

// @desc    Home page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('index', {
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
  res.render('user/login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const chronicles = await Chronicle.find({ user: req.user.id }).lean()
    const records = await Record.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      chronicles,
      records,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
