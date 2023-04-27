const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

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
    validate: [isURL, 'должна быть ссылка'],
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
