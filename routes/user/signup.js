var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');

//body-name, id, pw, email, user_image
router.post('/', upload.single('user_image'), async (req, res) => {
    const selectUserQuery = 'SELECT * FROM user WHERE id = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [req.body.id]);
    const signupQuery = 'INSERT INTO user (name, id, pw, salt, email, user_image) VALUES (?, ?, ?, ?, ?, ?)';
    if(selectUserResult.length == 0) { //id 중복 없음(회원 가입 성공)
        if(req.file == undefined){//이미지 없음
            const buf= await crypto.randomBytes(64);
            const salt = buf.toString('base64');
            const hashedPw = await crypto.pbkdf2(req.body.pw.toString(), salt, 1000, 32, 'SHA512');
            const signupResult = await db.queryParam_Parse(signupQuery, [req.body.name, req.body.id, hashedPw.toString('base64'), salt, req.body.email, null]);
            if (signupResult.length == 0) {
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.USER_INSERT_FAIL));
            } else {  
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
            }
        }else{//이미지 있음
            const buf = await crypto.randomBytes(64);
            const salt = buf.toString('base64');
            const hashedPw = await crypto.pbkdf2(req.body.pw.toString(), salt, 1000, 32, 'SHA512');
            const signupResult = await db.queryParam_Parse(signupQuery, [req.body.name, req.body.id, hashedPw.toString('base64'), salt, req.body.email, user_image]);
            if (signupResult.length == 0) {
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.USER_INSERT_FAIL));
            } else {  
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
            }
        }
    } else {//id중복
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.SIGNUP_FAIL));
    }
});

module.exports = router;