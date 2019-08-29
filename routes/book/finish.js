//다 읽었어요 버튼
var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const authUtil = require("../../module/authUtils");

//클라이언트한테 토큰 받아서 userIdx로 
//finish table에 특정 userIdx가 없는데 이벤트가 발생했으면 그 userIdx를 finish table에 넣어준다.
//finish table에 특정 userIdx가 있는데 이벤트가 발생했으면 그 userIdx를 finish table에서 삭제한다.

router.post('/', authUtil.isLoggedin, async(req, res)=>{//읽고 싶어요 누르는 이벤트
    const getFinishQuery = 'SELECT * FROM finishlist WHERE userIdx = ? AND bookIdx = ?';
    getFinishResult = await db.queryParam_Parse(getFinishQuery, [req.decoded.idx, req.body.bookIdx]);

    if(getFinishResult.length == 0){//wishlist테이블에 추가하기--> wish값 1
        const insertFinishQuery = 'INSERT INTO finishlist (userIdx, bookIdx) VALUES (?, ?)';
        const insertFinishResult = await db.queryParam_Parse(insertFinishQuery, [req.decoded.idx, req.body.bookIdx]);
        if(insertFinishResult.length == 0){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.Finish_INSERT_FAIL));//그냥 insert fail
        }else{
            const Finish_result = [];
            var Finish_json = new Object();
            Finish_json.Finish = 1;
            Finish_result.push(Finish_json);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.Finish_INSERT_SUCCESS, Finish_result));//wish값 1로 응답주기
        }
    }else{//wishlist 테이블에서 삭제하기-->wish값 0
        const deleteFinish = 'DELETE FROM finishlist WHERE userIdx = ? AND bookIdx = ?';
        const deleteFinishResult = await db.queryParam_Parse(deleteFinish, [req.decoded.idx, req.body.bookIdx]);
        if (deleteFinishResult.length == 0) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.Finish_DELETE_FAIL));//그냥 delete fail
        } else {
            const Finish_result = [];
            var Finish_json = new Object();
            Finish_json.Finish = 0;
            Finish_result.push(Finish_json);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.Finish_DELETE_SUCCESS, Finish_result));//wish값을 0으로 응답주기
        }
    }
});



module.exports = router;