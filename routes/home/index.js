var express = require('express');
var router = express.Router();

router.use('/book', require('./book'));
router.use('/curator', require('./curator'));

module.exports = router;