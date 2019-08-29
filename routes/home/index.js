var express = require('express');
var router = express.Router();

router.use('/', require('./book'));
router.use('/curator', require('./curator'));
router.use('/main', require('./main'));
router.use('/question', require('./question'));

module.exports = router;