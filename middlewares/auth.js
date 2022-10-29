const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');
const UnauthorizedErrorHandler = require('../errorsHandlers/UnauthorizedErrorHandler');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new UnauthorizedErrorHandler('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedErrorHandler('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
