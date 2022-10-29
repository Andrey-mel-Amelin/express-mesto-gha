const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { validAuthName } = require('./middlewares/joiValidation');
const NotFoundErrorHandler = require('./errorsHandlers/NotFoundErrorHandler');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.post('/signin', validAuthName, login);
app.post('/signup', validAuthName, createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundErrorHandler('Некорректный запрос'));
});

app.use(errors());
app.use(centralizedErrorHandler);
app.listen(PORT);
