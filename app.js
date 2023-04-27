require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { UNIQUE_FIELD, NOT_FOUND } = require('./utils/statuses');
const { url } = require('./utils/const');

const app = express();
const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(url).min(2),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', () => {
  throw new NotFoundError(NOT_FOUND.message);
});

app.use(errors());

app.use((err, req, res, next) => {
  let statusCode;
  let message;
  if (err.code === 11000) {
    statusCode = UNIQUE_FIELD.code;
    message = UNIQUE_FIELD.message;
  } else {
    statusCode = err.statusCode || err.code || 500;
    message = err.message;
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App start at ${PORT}`);
});
