const NOT_FOUND = 'NotFound';
const CAST_ERROR = 'CastError';
const ERROR_EMAIL_OR_PASSWORD = 'Неправильные почта или пароль';
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
const VALIDATION_ERROR = 'Validation failed';
const allowedCors = [
  'https://amelin.mesto.nomoredomains.icu,',
  'https://amelin.mesto.backend.nomoredomains.icu,',
  'http://amelin.mesto.nomoredomains.icu',
  'http://amelin.mesto.backend.nomoredomains.icu',
  'http://127.0.0.1/',
  'http://localhost:3000/',
  'localhost:3000',
];

module.exports = {
  NOT_FOUND,
  CAST_ERROR,
  ERROR_EMAIL_OR_PASSWORD,
  REGEX_URL,
  VALIDATION_ERROR,
  allowedCors,
};
