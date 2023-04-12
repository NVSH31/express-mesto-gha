const User = require('../models/user');
const {
  OK, CREATE,
  BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../utils/statuses');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(SERVER_ERROR.code).send(SERVER_ERROR.message));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(OK).send(user);
      }
      return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
    })
    .catch(() => res.status(SERVER_ERROR.code).send(SERVER_ERROR.message));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
      }
      return res.status(SERVER_ERROR.code).send(SERVER_ERROR.message);
    });
};

const updateUser = (req, res, body) => {
  User.findByIdAndUpdate(
    req.user._id,
    body,
    { new: true, runValidators: true },
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
      }
      return res.status(SERVER_ERROR.code).send(SERVER_ERROR.message);
    });
};

module.exports.updateProfile = (req, res) => {
  const body = { name: req.body.name, about: req.body.about };
  updateUser(req, res, body);
};

module.exports.updateAvatar = (req, res) => {
  const body = { avatar: req.body.avatar };
  updateUser(req, res, body);
};
