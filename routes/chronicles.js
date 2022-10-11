const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Chronicle = require('../models/Chronicle')

// @desc    Show add chronicle page
// @route   GET /chronicles/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('chronicles/add-chronicle')
})

// @desc    Process add chronicle form
// @route   POST /chronicles
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    console.log(req.body)

    //Convert chronological data to single array of objects
    let chronologicalBody, categoricalBody;
    if(req.body.chronicleType === 'chronological'){
      chronologicalBody = [];
      if(Array.isArray(req.body.chronologicalText)){
          for(let i = 0; i < req.body.chronologicalText.length; i++){
          chronologicalBody.push({
            startDate: req.body.startDate[i],
            endDate: req.body.endDate[i],
            chronologicalText: req.body.chronologicalText[i]
          })
        }
      }else {
        chronologicalBody.push({
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          chronologicalText: req.body.chronologicalText
        })
      }
    }
    //Convert categorical data to single array of objects
    else if(req.body.chronicleType === 'categorical'){
      categoricalBody = [];
      if(Array.isArray(req.body.categoricalText)){
        for(let i = 0; i < req.body.categoricalText.length; i++){
          categoricalBody.push({
            topic: req.body[`topic${i}`],
            categoricalText: req.body.categoricalText[i]
          })
        }
      }else {
        categoricalBody.push({
          topic: req.body.topic0,
          categoricalText: req.body.categoricalText
        })
      }
    }

    //Add chronicle
    await Chronicle.create({
      chronicleType: req.body.chronicleType,
      status: req.body.status,
      title: req.body.title,
      freestyleBody: req.body.freestyleText || null,
      chronologicalBody: chronologicalBody || null,
      categoricalBody: categoricalBody || null,
      user: req.body.user
    })

    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single chronicle
// @route   GET /chronicles/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let chronicle = await Chronicle.findById(req.params.id).populate('user').lean()

    if (!chronicle) {
      return res.render('error/404')
    }
    if (chronicle.user._id != req.user.id && chronicle.status == 'Private') {
      res.render('error/404')
    } else {
      res.render('chronicles/show-chronicle', {
        chronicle,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit chronicle page
// @route   GET /chronicles/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const chronicle = await Chronicle.findOne({ _id: req.params.id }).lean()

    if (!chronicle) {
      return res.render('error/404')
    }
    if (chronicle.user != req.user.id) {
      res.redirect('/dashboard')
    } else {
      res.render('chronicles/edit-chronicle', {
        chronicle,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Process edit chronicle form
// @route   PUT /chronicles/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let chronicle = await Chronicle.findById(req.params.id).lean()

    if (!chronicle) {
      return res.render('error/404')
    }
    if (chronicle.user != req.user.id) {
      res.redirect('/dashboard')
    } else {
      chronicle = await Chronicle.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete chronicle
// @route   DELETE /chronicles/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let chronicle = await Chronicle.findById(req.params.id).lean()

    if (!chronicle) {
      return res.render('error/404')
    }
    if (chronicle.user != req.user.id) {
      res.redirect('/dashboard')
    } else {
      await Chronicle.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Show all public chronicles
// @route   GET /chronicles
router.get('/', ensureAuth, async (req, res) => {
  try {
    const chronicles = await Chronicle.find({ status: 'Public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('chronicles/public', {
      chronicles,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all public chronicles by single user
// @route   GET /chronicles/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const chronicles = await Chronicle.find({
      user: req.params.userId,
      status: 'Public',
    })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('chronicles/public', {
      chronicles,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
