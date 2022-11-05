const NOT_FOUND = 'NotFound';
const CAST_ERROR = 'CastError';
const JWT_SECRET = '426fd19a8c2c34a673d770d58ea0360e4fdb942c1f6ddbde40a68d32062e48be';
const ERROR_EMAIL_OR_PASSWORD = 'Неправильные почта или пароль';
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
const VALIDATION_ERROR = 'Validation failed';
const allowedCors = [
  'https://amelin.mesto.nomoredomains.icu,',
  'https://amelin.mesto.backend.nomoredomains.icu,',
  'http://amelin.mesto.nomoredomains.icu',
  'http://amelin.mesto.backend.nomoredomains.icu',
  'http://127.0.0.1',
  'http://localhost:3000',
];

module.exports = {
  NOT_FOUND,
  CAST_ERROR,
  JWT_SECRET,
  ERROR_EMAIL_OR_PASSWORD,
  REGEX_URL,
  VALIDATION_ERROR,
  allowedCors,
};
