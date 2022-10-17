const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '634c71012c17c6b4ec342982',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Некорректный путь запроса' });
});

app.listen(PORT);
