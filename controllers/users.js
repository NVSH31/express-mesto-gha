const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK, CREATE, NOT_FOUND,
  // BAD_REQUEST, UNAUTHORIZED, SERVER_ERROR,
} = require('../utils/statuses');
// const BadRequestError = require('../errors/bad-request-error');
// const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
// const UniqueError = require('../errors/unique-error');
// const ServerError = require('../errors/server-error');

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
  // .catch((err) => {
  //   if (err.name === '') {
  //     return res
  //       .status(UNAUTHORIZED)
  //       .send({ message: UNAUTHORIZED.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
  // .catch(() => res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(OK).send(user);
      }
      // return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(OK).send(user);
      }
      // return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
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
      // const newUser = user.toObject();
      // delete newUser.password;
      // res.status(CREATE).send(newUser);
      res.status(CREATE).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     return res.status(BAD_REQUEST.code).send({ message: err.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
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
      // return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     return res.status(BAD_REQUEST.code).send({ message: err.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
};

module.exports.updateProfile = (req, res) => {
  const body = { name: req.body.name, about: req.body.about };
  updateUser(req, res, body);
};

module.exports.updateAvatar = (req, res) => {
  const body = { avatar: req.body.avatar };
  updateUser(req, res, body);
};
