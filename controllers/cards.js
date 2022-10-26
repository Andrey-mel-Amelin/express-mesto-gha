const Cards = require('../models/cards');
const { NOT_FOUND, CAST_ERROR, VALIDATION_ERROR } = require('../constants');

module.exports.getCard = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return next();
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'У вас отсутствуют права для удаления карточки' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return next();
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return next();
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return next();
    });
};
