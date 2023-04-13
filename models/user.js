const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'это поле обязательно'],
    minlength: [2, 'должно быть не менее 2 символов'],
    maxlength: [30, 'должно быть не более 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'это поле обязательно'],
    minlength: [2, 'должно быть не менее 2 символов'],
    maxlength: [30, 'должно быть не более 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'это поле обязательно'],
  },
});

module.exports = mongoose.model('user', userSchema);
