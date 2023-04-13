const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'это поле обязательно'],
    minlength: [2, 'должно быть не менее 2 символов'],
    maxlength: [30, 'должно быть не более 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'это поле обязательно'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'это поле обязательно'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
