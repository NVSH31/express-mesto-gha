const Card = require('../models/card');
const {
  OK, NOT_FOUND, FORBIDDEN,
} = require('../utils/statuses');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN.message);
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(OK).send({ message: 'карточка удалена' }))
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.status(OK).send(card);
      }
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(OK).send(card);
      }
      throw new NotFoundError(NOT_FOUND.message);
    })
    .catch(next);
};
