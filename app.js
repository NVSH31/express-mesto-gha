require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// const { NOT_FOUND } = require('./utils/statuses');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
// app.use((req, res) => res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message }));

app.use((err, req, res, next) => {
  console.log('err =', err);
  console.log('err.statusCode =', err.statusCode);

  const { statusCode = 500, message } = err;
  // console.log('err.statusCode =', err.statusCode);
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
