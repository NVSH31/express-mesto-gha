const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getCards, createCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');
// const { auth } = require('../middlewares/auth');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).max(30), // сделать валидацию на ссылку
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
