const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const upload = require("../middleware/multer")
const cloudinary = require("../middleware/cloudinary")

const Record = require('../models/Record')

// @desc    Show add record page
// @route   GET /records/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('records/addRecord', {
    layout: 'add-edit',
  })
})

// // @desc    Process add record form
// // @route   POST /records
router.post('/', ensureAuth, upload.single('record'), async (req, res) => {
  try {
    req.body.user = req.user.id
    console.log(req.body)
    console.log(req.file)

    //Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path)

    await Record.create({
      title: req.body.title,
      recordType: req.body.recordType,
      notes: req.body.recordNotes,
      filePath: result.secure_url,
      cloudinaryId: result.public_id,
      user: req.body.user
    })
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// // @desc    Show single record
// // @route   GET /records/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let record = await Record.findById(req.params.id).populate('user').lean()

    if (!record) {
      return res.render('error/404')
    }

    if (record.user._id != req.user.id) {
      res.render('error/404')
    } else {
      res.render('records/showRecord', {
        record,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// // @desc    Show edit record page
// // @route   GET /record/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
    }).lean()

    if (!record) {
      return res.render('error/404')
    }

    if (record.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('records/editRecord', {
        record,
        layout: 'add-edit',
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// // @desc    Process edit record form
// // @route   PUT /records/:id
router.put('/:id', ensureAuth, upload.single('record'), async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  try {
    let record = await Record.findById(req.params.id).lean()

    if (!record) {
      return res.render('error/404')
    }

    if (record.user != req.user.id) {
      res.redirect('/stories')
    } else {
      //Upload file to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path)

      record = await Record.findOneAndUpdate({ _id: req.params.id }, req.body, req.file, {
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

// @desc    Delete record
// @route   DELETE /records/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let record = await Record.findById(req.params.id).lean()

    if (!record) {
      return res.render('error/404')
    }

    if (record.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Record.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router
