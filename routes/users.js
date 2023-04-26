const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).max(30), // сделать валидацию на ссылку
  }),
}), updateAvatar);

module.exports = router;
