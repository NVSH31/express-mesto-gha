const { Joi } = require('celebrate');
const { url } = require('../utils/const');

const validateUserNameAbout = Joi.string().min(2).max(30);
const validateCardName = Joi.string().required().min(2).max(30);
const validateCardLink = Joi.string().required().regex(url).min(2);
const validateUrlAvatar = Joi.string().required().regex(url).min(2);
const validateAvatarSignup = Joi.string().regex(url).min(2);
const validateId = Joi.string().alphanum().length(24);
const validateEmail = Joi.string().required().email();
const validatePassword = Joi.string().required().min(6);

module.exports = {
  validateUserNameAbout,
  validateCardName,
  validateCardLink,
  validateUrlAvatar,
  validateAvatarSignup,
  validateId,
  validateEmail,
  validatePassword,
};
