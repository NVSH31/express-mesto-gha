const Card = require('../models/card');
const {
  OK, NO_CONTENT, UNAUTHORIZED, NOT_FOUND,
  // BAD_REQUEST, SERVER_ERROR,
} = require('../utils/statuses');
// const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
// const UniqueError = require('../errors/unique-error');
// const ServerError = require('../errors/server-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
  // .catch(() => res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK).send(card))
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     return res.status(BAD_REQUEST.code).send({ message: err.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND.message);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError(UNAUTHORIZED.message);
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(NO_CONTENT).send())
        .catch(next);
    })
    .catch(next);

  // .then((card) => {
  //   if (card && (card.owner.toString() === req.user._id)) {
  //     console.log('card =', card, ' req.user._id =', req.user._id);
  //     Card.findByIdAndRemove(req.params.cardId)
  //       .then(() => {
  //         // res.redirect('/cards');
  //         res.status(NO_CONTENT);
  //       });
  //   }
  //   return res.status(UNAUTHORIZED.code).send({ message: UNAUTHORIZED.message });
  // })
  // .catch((err) => {
  //   console.log('err =', err);
  //   if (err.name === 'CastError') {
  //     return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
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
      // return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
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
      // return res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });
  //   }
  //   return res.status(SERVER_ERROR.code).send({ message: SERVER_ERROR.message });
  // });
};
