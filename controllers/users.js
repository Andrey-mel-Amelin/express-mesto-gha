const mongoose = require('mongoose');
const Users = require('../models/users');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(500).send({ message: err });
    });
};

module.exports.createUser = (req, res) => {
  Users.create(req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(500).send({ message: err.name });
    });
};

module.exports.updateAvatar = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: ' Переданы некорректные данные при обновлении аватара' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(500).send({ message: err.message });
    });
};
