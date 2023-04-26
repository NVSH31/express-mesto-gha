const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const BadRequestError = require('../errors/bad-request-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'это поле обязательно'],
    unique: true,
    validate: [isEmail, 'должен быть email'],
  },
  password: {
    type: String,
    required: [true, 'это поле обязательно'],
    select: false,
    minlength: [6, 'должно быть не менее 6 символов'],
  },
  name: {
    type: String,
    minlength: [2, 'должно быть не менее 2 символов'],
    maxlength: [30, 'должно быть не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'должно быть не менее 2 символов'],
    maxlength: [30, 'должно быть не более 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'это поле обязательно'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequestError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequestError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
