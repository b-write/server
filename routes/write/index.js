var express = require('express');
var router = express.Router();

router.use('/answer', require('./answer'));
router.use('/question', require('./question'));
router.use('/myQuestionList', require('./myQuestionList'));
router.use('/questionList', require('./questionList'))

module.exports = router;