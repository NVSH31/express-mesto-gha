const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.send({ message: err }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => res.send({ message: err }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.send({ message: err }));
};

const updateUser = (req, res, body) => {
  User.findByIdAndUpdate(
    req.user._id,
    body,
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => res.send({ message: err }));
};

module.exports.updateProfile = (req, res) => {
  const body = { name: req.body.name, about: req.body.about };
  updateUser(req, res, body);
};

module.exports.updateAvatar = (req, res) => {
  const body = { avatar: req.body.avatar };
  updateUser(req, res, body);
};
