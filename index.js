const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('./app/config');
const apiRoutes = require('./app/routes/routes');
const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
  poolSize: 100,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
};

mongoose.connect(config.database, options);
mongoose.set('useFindAndModify', false);
app.set('superSecret', config.serverSecret);

app.use('/api', apiRoutes);

app.get('/', function(req, res) {
  res.status(200);
  res.json({
    success: true,
    message: 'Welcome to the coolest API on the earth!',
  });
});

app.listen(port);
console.log('Backend server is running on http://localhost:3000');