const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '6436458f0003791829e3edeb',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/cards', cardRouter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT);
