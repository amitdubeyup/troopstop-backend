const express = require('express');
const routes = express.Router();

const checkUpdateRoutes = require('./check-update.routes');
const jwtRoutes = require('./jwt.routes');
const mailRoutes = require('./mail.routes');
const smsRoutes = require('./sms.routes');
const locationRoutes = require('./location.routes');
const userRoutes = require('./user.routes');
const fileRoutes = require('./file.routes');
const chatRoutes = require('./chat.routes');

routes.use('/update', checkUpdateRoutes);
routes.use('/jwt', jwtRoutes);
routes.use('/mail', mailRoutes);
routes.use('/sms', smsRoutes);
routes.use('/location', locationRoutes);
routes.use('/user', userRoutes);
routes.use('/file', fileRoutes);
routes.use('/chat', chatRoutes);


routes.get('/', function (req, res) {
  res.status(200);
  res.json({
    success: true,
    message: 'Welcome to the coolest API on the earth!',
  });
});

module.exports = routes;