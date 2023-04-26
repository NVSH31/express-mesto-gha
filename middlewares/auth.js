const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/statuses');

const { SECRET_KEY = 'my_secret_key' } = process.env;

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res
      .status(UNAUTHORIZED.code)
      .send({ message: UNAUTHORIZED.message });
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res
      .status(UNAUTHORIZED.code)
      .send({ message: UNAUTHORIZED.message });
  }

  req.user = payload;

  return next();
};
