const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/setting');

router.post('/add', SettingController.addSetting);
router.post('/fetch', SettingController.fetchSetting);
router.post('/fetch-all', SettingController.fetchAllSetting);
router.post('/update', SettingController.updateSetting);
router.post('/update-all', SettingController.updateAllSetting);
router.post('/remove', SettingController.removeSetting);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !',
    });
});

module.exports = router;