const express = require('express');
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

let connectionResponse = null;
config.DB.authenticate().then((res) => {
  console.log('Database connected successfully!');
  connectionResponse = {
    message: 'Database connected successfully!',
    data: res
  };
}).catch((err) => {
  console.log(err);
  connectionResponse = {
    message: 'Unable to establish a connection with the database!',
    data: err
  };
});

app.use('/api', routes);

app.use('/', (req, res) => {
  res.status(200);
  res.json({
    status: true,
    message: 'Welcome to the coolest API on the earth!',
    data: connectionResponse
  });
});

app.listen(port);

console.log('Server is running successfully!');