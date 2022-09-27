const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  chronicleType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  freestyleBody: {
    type: String,
  },
  chronologicalBody: {
    type: Array,
  },
  categoricalBody: {
    type: Array,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Story', StorySchema)
