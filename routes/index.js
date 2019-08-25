var express = require('express');
var router = express.Router();

router.use('/home', require('./home'));
router.use('/write', require('./write'));
router.use('/book', require('./book'));
router.use('/user', require('./user'));

module.exports = router;
