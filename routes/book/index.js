var express = require('express');
var router = express.Router();

router.use('/finish', require('./finish'));
router.use('/question', require('./question'));
router.use('/wish', require('./wish'));
router.use('/main', require('./main'));

module.exports = router;