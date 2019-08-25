//책 상세 소개 페이지& 책 소개 탭
var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

//bookIdx을 클라한테 받아서(params)
//book_image, title, author, wishlist table 에 있는 특정 bookIdx에 해당하는 것들의 합(sum(*))
//finishlist table 에 있는 특정 bookIdx에 해당하는 것들의 합(sum(*))
//defualt-책 소개 탭, summary

//나중에 사용자별로 읽고 싶어요 눌렀는지, 다 읽었어요 눌렀는지 0,1로 응답 추가하기!!!!

router.get('/:bookIdx', async(req, res)=>{
    const getBookQuery = 'SELECT book_image, title, author, summary FROM book WHERE bookIdx = ?';
    const getWishQuery = 'SELECT count(*) FROM wishlist WHERE bookIdx = ?';//읽고 싶어요 수
    const getFinishQuery = 'SELECT count(*) FROM finishlist WHERE bookIdx = ?';//다 읽었어요 수

    const selectTransaction = await db.Transaction(async(connection) => {
        getBookResult = await connection.query(getBookQuery, [req.params.bookIdx]);
        getWishResult = await connection.query(getWishQuery, [req.params.bookIdx]);
        getFinishResult = await connection.query(getFinishQuery, [req.params.bookIdx]);
    });
    if(selectTransaction == 0){//트랜잭션 실패
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.BOOK_MAIN_FAIL));
    }else{//트랜잭션 성공
        getBookResult[0]['wish'] = getWishResult[0]['count(*)'];
        getBookResult[0]['finish'] = getFinishResult[0]['count(*)']
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.BOOK_MAIN_SUCCESS, getBookResult));
    }
});

module.exports = router;