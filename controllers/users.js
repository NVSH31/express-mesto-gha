const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK, CREATE, NOT_FOUND,
} = require('../utils/statuses');
const NotFoundError = require('../errors/not-found-error');

const { SECRET_KEY = 'my_secret_key' } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
        })
        .status(OK)
        .send({ message: 'токен отправлен в куки' });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(OK).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(OK).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(CREATE).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(next);
};

const updateUser = (req, res, body, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    body,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.status(OK).send(user);
      }
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const body = { name: req.body.name, about: req.body.about };
  updateUser(req, res, body);
};

module.exports.updateAvatar = (req, res) => {
  const body = { avatar: req.body.avatar };
  updateUser(req, res, body);
};
