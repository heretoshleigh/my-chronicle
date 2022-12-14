const mongoose = require('mongoose')

const ChronicleSchema = new mongoose.Schema({
  chronicleType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Public', 'Private'],
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

module.exports = mongoose.model('Chronicle', ChronicleSchema)
