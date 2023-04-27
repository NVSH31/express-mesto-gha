const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
// const { url } = require('../utils/const');
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
    // name: Joi.string().required().min(2).max(30),
    // link: Joi.string().required().regex(url).min(2),
    name: validateCardName,
    link: validateCardLink,
  }),
}), auth, createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    // cardId: Joi.string().alphanum().length(24),
    cardId: validateId,
  }),
}), auth, deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    // cardId: Joi.string().alphanum().length(24),
    cardId: validateId,
  }),
}), auth, likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    // cardId: Joi.string().alphanum().length(24),
    cardId: validateId,
  }),
}), auth, dislikeCard);

module.exports = router;
