const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const url = require('../utils/const');
const {
  getCards, createCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(RegExp(url)).min(2), // сделать валидацию на ссылку
  }),
}), auth, createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
