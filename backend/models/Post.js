const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);
