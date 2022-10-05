const mongoose = require('mongoose')

const RecordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  recordType: {
    type: String,
    enum: ['doctor visit', 'test result', 'prescription', 'other'],
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Record', RecordSchema)
