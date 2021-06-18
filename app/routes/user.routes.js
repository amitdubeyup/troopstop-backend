const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const UserGuard = require('../auth/auth');
const dataValidator = require('../validator/data');

router.post('/send-otp', dataValidator, UserController.sendOtp);
router.post('/login', dataValidator, UserController.loginUser);
router.post('/register', dataValidator, UserController.registerUser);
router.post('/fetch', dataValidator, UserGuard, UserController.fetchUser);
router.post('/fetch-all', dataValidator, UserGuard, UserController.fetchAllUser);
router.post('/update', dataValidator, UserGuard, UserController.updateUser);
router.post('/update-all', dataValidator, UserGuard, UserController.updateAllUser);
router.post('/remove', dataValidator, UserGuard, UserController.removeUser);

router.get('/', function (req, res, next) {
  res.status(200);
  res.json({
    message: 'Welcome to coolest api on the earth !',
  });
});

module.exports = router;