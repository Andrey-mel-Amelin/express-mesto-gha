const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const {
  JWT_SECRET,
  NOT_FOUND,
  ERROR_EMAIL_OR_PASSWORD,
  VALIDATION_ERROR,
  CAST_ERROR,
} = require('../constants');
const DublicateKeyErrorHandler = require('../errorsHandlers/DublicateKeyErrorHandler');
const NotFoundErrorHandler = require('../errorsHandlers/NotFoundErrorHandler');
const UnauthorizedErrorHandler = require('../errorsHandlers/UnauthorizedErrorHandler');
const BadReqErrorHandler = require('../errorsHandlers/BadReqErrorHandler');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .status(200)
        .send({ message: 'Пользователь успешно авторизирован.' });
    })
    .catch((err) => {
      if (err.message === ERROR_EMAIL_OR_PASSWORD) {
        return next(new UnauthorizedErrorHandler(err.message));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => Users.findById(user._id))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqErrorHandler('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new DublicateKeyErrorHandler('Пользователь с таким email уже существует.'));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId || req.user._id)
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadReqErrorHandler('Переданы некорректный _id для поиска пользователя.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundErrorHandler('Запрашиваемый пользователь не найден.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqErrorHandler('Переданы некорректные данные при обновлении пользователя.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundErrorHandler('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqErrorHandler('Переданы некорректные данные при обновлении аватара пользователя.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundErrorHandler('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};
