const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  validateCardName, validateCardLink, validateId,
} = require('../validators/validators');
const {
  getCards, createCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: validateCardName,
    link: validateCardLink,
  }),
}), auth, createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: validateId,
  }),
}), auth, deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: validateId,
  }),
}), auth, likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: validateId,
  }),
}), auth, dislikeCard);

module.exports = router;
