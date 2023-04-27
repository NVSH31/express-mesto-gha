const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  validateId, validateUserNameAbout, validateUrlAvatar,
} = require('../validators/validators');
const {
  getUsers, getUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: validateId,
  }),
}), auth, getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: validateUserNameAbout,
    about: validateUserNameAbout,
  }),
}), auth, updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: validateUrlAvatar,
  }),
}), auth, updateAvatar);

module.exports = router;
