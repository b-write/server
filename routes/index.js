var express = require('express');
var router = express.Router();

router.use('/home', require('./home'));
<<<<<<< HEAD
router.use('/write', require('./write'));
=======
router.use('/book', require('./book'));
router.use('/user', require('./user'));
>>>>>>> b255b7ac2ed0dc3ecf4d6188dd493c2376ee469c

module.exports = router;
