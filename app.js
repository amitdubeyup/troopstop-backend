const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./app/config');
const routes = require('./app/routes/routes');
const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

config.DB.authenticate().then(() => {
  console.log('Database connected successfully!');
}).catch((err) => {
  console.log('Unable to establish a connection with the database!');
  console.log(err);
});

app.use('/', (req, res) => {
  res.status(200);
  res.json({
    status: true,
    message: 'Welcome to the coolest API on the earth!',
  });
});

app.use('/api', routes);

app.listen(port);

console.log('Server is running successfully!');