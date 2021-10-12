const mongoose = require('mongoose')

const inquirySchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: []
}, {
  timestamps: true
})

module.exports = mongoose.model('Inquiry', inquirySchema)
