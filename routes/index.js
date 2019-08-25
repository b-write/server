var express = require('express');
var router = express.Router();

router.use('/home', require('./home'));
router.use('/write', require('./write'));

module.exports = router;
