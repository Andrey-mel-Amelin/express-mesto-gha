const Cards = require('../models/cards');
const { NOT_FOUND, CAST_ERROR, VALIDATION_ERROR } = require('../constants');
const BadReqErrorHandler = require('../errorsHandlers/BadReqErrorHandler');
const HandlerForbiddenError = require('../errorsHandlers/HandlerForbiddenError');
const NotFoundErrorHandler = require('../errorsHandlers/NotFoundErrorHandler');

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
        return next(new BadReqErrorHandler('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new HandlerForbiddenError('У вас отсутствуют права для удаления карточки.'));
      }
      res.status(200).send({ data: card });
      return Cards.findByIdAndDelete(card._id.toString());
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqErrorHandler('Переданы некорректные данные карточки.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundErrorHandler('Карточка с указанным _id не найдена.'));
      }
      return next(err);
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
        next(new BadReqErrorHandler('Переданы некорректные данные для постановки лайка.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundErrorHandler('Передан несуществующий _id карточки.'));
      }
      return next(err);
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
        return next(new BadReqErrorHandler('Переданы некорректные данные для снятии лайка.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundErrorHandler('Передан несуществующий _id карточки.'));
      }
      return next(err);
    });
};
