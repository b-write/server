var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

//home/main
//책 추천(어떤 알고리즘으로...?)-->그냥 랜던 값 3개 뽑아오기
//큐레이터 추천(어떤 알고리즘..?-->모든 큐레이터 값 다 가져오기
//가장 인기 많은 질문들
//ORDER BY RAND() LIMIT 3

router.get('/', async(req, res)=>{
    const getBookQuery = 'SELECT bookIdx, title, author, book_image FROM book WHERE bookIdx IN (17, 49, 50, 25, 30, 43)';//3개 랜덤 추출
    const getCuratorQuery = 'SELECT name, job, curator_image, curator_intro, book_image FROM curator JOIN book ON curator.bookIdx = book.bookIdx';//메인에서 책은 이미지만 필요
    const getQuestionQuery = 'SELECT questionIdx, question_content, question_likes, book_image FROM question JOIN book ON question.bookIdx = book.bookIdx ORDER BY question_likes DESC LIMIT 3';//질문 좋아요 수 상위3개 추출

    const selectTransaction = await db.Transaction(async(connection) => {
        getBookResult = await connection.query(getBookQuery);
        getCuratorResult = await connection.query(getCuratorQuery, [req.params.name]);
        getQuestionResult = await connection.query(getQuestionQuery, [req.params.name]);
    });
    if(selectTransaction == 0){//트랜잭션 실패
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.MAIN_FAIL));
    }else{//트랜잭션 성공
        var main_json = new Object();
        const book = [];
        const curator = [];
        const question = [];
        for(var i=0; i< getBookResult.length; i++){
            book.push(getBookResult[i]);
        }
        main_json.book = book;
        for(var i=0; i< getCuratorResult.length; i++){
            curator.push(getCuratorResult[i]);
        }
        main_json.curator = curator;
        for(var i=0; i< getQuestionResult.length; i++){
            question.push(getQuestionResult[i]);
        }
        main_json.question = question;

        res.status(200).send(util.successTrue(statusCode.OK, resMessage.MAIN_SUCCESS, main_json));
    }
});

module.exports = router;