const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const upload = require("../middleware/multer")
const cloudinary = require("../middleware/cloudinary")

const Story = require('../models/Record')

// @desc    Show add page
// @route   GET /records/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('records/addRecord', {
    layout: 'add-edit',
  })
})

// // @desc    Process add form
// // @route   POST /records
router.post('/', ensureAuth, upload.single('record'), async (req, res) => {
  try {
    req.body.user = req.user.id
    console.log(req.body)
    console.log(req.record)

    //Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.record.path)

    await Record.create({
      title: req.body.title,
      recordType: req.body.recordType,
      filePath: result.scure_url,
      cloudinaryId: result.public_id,
      user: req.body.user
    })
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// // @desc    Show single story
// // @route   GET /stories/:id
// router.get('/:id', ensureAuth, async (req, res) => {
//   try {
//     let story = await Story.findById(req.params.id).populate('user').lean()

//     if (!story) {
//       return res.render('error/404')
//     }

//     if (story.user._id != req.user.id && story.status == 'private') {
//       res.render('error/404')
//     } else {
//       res.render('stories/show', {
//         story,
//       })
//     }
//   } catch (err) {
//     console.error(err)
//     res.render('error/404')
//   }
// })

// // @desc    Show edit page
// // @route   GET /stories/edit/:id
// router.get('/edit/:id', ensureAuth, async (req, res) => {
//   try {
//     const story = await Story.findOne({
//       _id: req.params.id,
//     }).lean()

//     if (!story) {
//       return res.render('error/404')
//     }

//     if (story.user != req.user.id) {
//       res.redirect('/stories')
//     } else {
//       res.render('stories/edit', {
//         story,
//         layout: 'add-edit',
//       })
//     }
//   } catch (err) {
//     console.error(err)
//     return res.render('error/500')
//   }
// })

// // @desc    Update story
// // @route   PUT /stories/:id
// router.put('/:id', ensureAuth, async (req, res) => {
//   try {
//     let story = await Story.findById(req.params.id).lean()

//     if (!story) {
//       return res.render('error/404')
//     }

//     if (story.user != req.user.id) {
//       res.redirect('/stories')
//     } else {
//       story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
//         new: true,
//         runValidators: true,
//       })

//       res.redirect('/dashboard')
//     }
//   } catch (err) {
//     console.error(err)
//     return res.render('error/500')
//   }
// })

// // @desc    Delete story
// // @route   DELETE /stories/:id
// router.delete('/:id', ensureAuth, async (req, res) => {
//   try {
//     let story = await Story.findById(req.params.id).lean()

//     if (!story) {
//       return res.render('error/404')
//     }

//     if (story.user != req.user.id) {
//       res.redirect('/stories')
//     } else {
//       await Story.remove({ _id: req.params.id })
//       res.redirect('/dashboard')
//     }
//   } catch (err) {
//     console.error(err)
//     return res.render('error/500')
//   }
// })

// // @desc    User stories
// // @route   GET /stories/user/:userId
// router.get('/user/:userId', ensureAuth, async (req, res) => {
//   try {
//     const stories = await Story.find({
//       user: req.params.userId,
//       status: 'public',
//     })
//       .populate('user')
//       .lean()

//     res.render('stories/index', {
//       stories,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })

module.exports = router
