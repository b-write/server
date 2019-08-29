var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const jwtUtils = require('../../module/jwt');

//body-email, pw
router.post('/', async(req, res) => {
    if (!req.body.email || !req.body.pw) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        const selectUserQuery = 'SELECT * FROM user WHERE email = ?'
        const selectUserResult = await db.queryParam_Parse(selectUserQuery, [req.body.email]);
        if(selectUserResult.length == 0){//해당 id을 가진 사용자 없음
            res.status(200).send(util.successFalse(statusCode.OK, resMessage.NO_USER));
        }else{
            const salt = selectUserResult[0].salt;
            const hashedEnterPw = await crypto.pbkdf2(req.body.pw.toString(),salt,1000, 32, 'SHA512');
            if(selectUserResult[0].pw == hashedEnterPw.toString('base64')){
                const tokens = jwtUtils.sign(selectUserResult[0]);
                const token_result = [];
                var json = new Object();
                json.token = tokens.token;
                token_result.push(json);
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, token_result)); //token, refreshtoken 찍어줌
                // }
            }else{//비밀번호 불일치
                res.status(200).send(util.successFalse(statusCode.OK, resMessage.MISS_MATCH_PW));
            }
        }
    }
});

module.exports = router;