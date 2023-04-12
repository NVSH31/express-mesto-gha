const Card = require('../models/card');
const {
  OK, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../utils/statuses');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(SERVER_ERROR.code).send(SERVER_ERROR.message));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
      }
      return res.status(SERVER_ERROR.code).send(SERVER_ERROR.message);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.status(OK))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
      }
      return res.status(SERVER_ERROR.code).send(SERVER_ERROR.message);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true, runValidators: true },
  )
    .then((cards) => res.status(OK).send(cards))
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((cards) => res.status(OK).send(cards))
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
