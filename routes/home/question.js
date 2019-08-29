var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

//questionIdx에 해당하는 bookIdx의 title, author, question_content, book_image, question_date
//questionIdx에 해당하는 답변의 수 count(*)
//qestionIdx에 해당하는 answer_content, user_image, name(닉네임 역할), answer_likes, answer_date

//body-questinIdx를 받아서->defualt 좋아요 순
router.post('/', async (req, res) => {
    const getQuestionQuery = 'SELECT title, author, question_content, book_image, question_date FROM question JOIN book ON question.bookIdx = book.bookIdx WHERE questionIdx = ?';
    const getAnswerQuery = 'SELECT answer_content, answer_likes, answer_date FROM answer JOIN question ON answer.questionIdx = question.questionIdx WHERE answer.questionIdx = ? ORDER BY answer_likes desc';
    const getAnswerNumQuery = 'SELECT count(*) FROM answer WHERE questionIdx = ?';

    const selectTransaction = await db.Transaction(async(connection) => {
        getQuestionResult = await db.queryParam_Parse(getQuestionQuery, [req.body.questionIdx]);
        getAnswerResult = await db.queryParam_Parse(getAnswerQuery, [req.body.questionIdx]);
        getAnswerNumResult = await db.queryParam_Parse(getAnswerNumQuery, [req.body.questionIdx]);
    });

    if(selectTransaction == 0){//트랜잭션 실패
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.QUESTION_LOAD_FAIL));
    }else{//트랜잭션 성공
        getQuestionResult[0].answer_num = getAnswerNumResult[0]['count(*)'];
        const question_result=[];
        question_result.push(getQuestionResult[0]);
        for(var i=0; i<getAnswerResult.length; i++){
            question_result.push(getAnswerResult[i]);
        }
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.QUESTION_LOAD_SUCCESS, question_result));
    }
});

//body-questinIdx를 받아서->최신순
router.post('/latest', async (req, res) => {
    const getAnswerQuery = 'SELECT answer_content, answer_likes, answer_date FROM answer JOIN question ON answer.questionIdx = question.questionIdx WHERE answer.questionIdx = ? ORDER BY answer_date desc';
    getAnswerResult = await db.queryParam_Parse(getAnswerQuery, [req.body.questionIdx]);

    if(getAnswerResult.length == 0){//트랜잭션 실패
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.QUESTION_LOAD_FAIL));
    }else{//트랜잭션 성공
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.QUESTION_LOAD_SUCCESS, getAnswerResult));
    }
});

module.exports = router;