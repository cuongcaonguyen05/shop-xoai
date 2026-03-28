const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');

router.post('/register',  ctrl.register);
router.post('/login',     ctrl.login);
router.post('/google',       ctrl.googleLogin);
router.post('/google-token', ctrl.googleTokenLogin);
router.post('/facebook',  ctrl.facebookLogin);
router.get('/me',         ctrl.getMe);
router.get('/users',      ctrl.getAllUsers);

module.exports = router;
