const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const { url } = require('../utils/const');
const {
  getUsers, getUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), auth, getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(url),
  }),
}), auth, updateAvatar);

module.exports = router;
