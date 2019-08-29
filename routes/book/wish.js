//읽고 싶어요 버튼
var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const authUtil = require("../../module/authUtils");

//클라이언트한테 header-토큰 , body-bookIdx값 받기
//wish table에 특정 userIdx가 없는데 이벤트가 발생했으면 그 userIdx를 wish table에 넣어준다.
//wish table에 특정 userIdx가 있는데 이벤트가 발생했으면 그 userIdx를 wish table에서 삭제한다.

router.post('/', authUtil.isLoggedin, async(req, res)=>{//읽고 싶어요 누르는 이벤트
    const getWishQuery = 'SELECT * FROM wishlist WHERE userIdx = ? AND bookIdx = ?';
    getWishResult = await db.queryParam_Parse(getWishQuery, [req.decoded.idx, req.body.bookIdx]);

    if(getWishResult.length == 0){//wishlist테이블에 추가하기--> wish값 1
        const insertWishQuery = 'INSERT INTO wishlist (userIdx, bookIdx) VALUES (?, ?)';
        const insertWishResult = await db.queryParam_Parse(insertWishQuery, [req.decoded.idx, req.body.bookIdx]);
        if(insertWishResult.length == 0){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.WISH_INSERT_FAIL));//그냥 insert fail
        }else{
            const wish_result = [];
            var wish_json = new Object();
            wish_json.wish = 1;
            wish_result.push(wish_json);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.WISH_INSERT_SUCCESS, wish_result));//wish값 1로 응답주기
        }
    }else{//wishlist 테이블에서 삭제하기-->wish값 0
        const deleteWish = 'DELETE FROM wishlist WHERE userIdx = ? AND bookIdx = ?';
        const deleteWishResult = await db.queryParam_Parse(deleteWish, [req.decoded.idx, req.body.bookIdx]);
        if (deleteWishResult.length == 0) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.WISH_DELETE_FAIL));//그냥 delete fail
        } else {
            const wish_result = [];
            var wish_json = new Object();
            wish_json.wish = 0;
            wish_result.push(wish_json);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.WISH_DELETE_SUCCESS, wish_result));//wish값을 0으로 응답주기
        }
    }
});


module.exports = router;