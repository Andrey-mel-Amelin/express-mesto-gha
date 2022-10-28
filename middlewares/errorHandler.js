const { VALIDATION_ERROR } = require('../constants')

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err.message === VALIDATION_ERROR) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  return next();
};
