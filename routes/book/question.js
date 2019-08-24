//질문 쓰기, 그 책에 대한 질문 탭 2개 api
var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

//질문 쓰기
//book_image, title, author
router.get('/:bookIdx', async(req, res)=>{
    const getBookQuery = 'SELECT book_image, title, author FROM book WHERE bookIdx = ?';
    getBookResult = await db.queryParam_Parse(getBookQuery, [req.params.bookIdx]);

    if(getBookResult.length == 0){
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.BOOK_QUESTION_WRITE_FAIL));
    }else{
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.BOOK_QUESTION_WRITE_SUCCESS, getBookResult));
    }
});

//질문 탭
//question_content, user_image, name, question_likes, 특정 questionIdx에 대한 답글 수
router.get('/tab/:bookIdx', async(req, res)=>{
    const getQuestionQuery = 'SELECT questionIdx, question_content, user_image, name, question_likes FROM question JOIN user ON question.userIdx = user.userIdx WHERE bookIdx = ?';
    getQuestionResult = await db.queryParam_Parse(getQuestionQuery, [req.params.bookIdx]);

    if(getQuestionResult.length == 0){
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.BOOK_QUESTION_TAB_FAIL));
    }else{
        for(var i=0; i< getQuestionResult.length; i++){//각 questionIdx에 대한 답글 수 가져오기
            const getAnswerNumQuery = 'SELECT count(*) FROM answer JOIN question ON answer.questionIdx = question.questionIdx  WHERE answer.questionIdx = ?';
            getAnswerNumResult = await db.queryParam_Parse(getAnswerNumQuery, [getQuestionResult[i]['questionIdx']]);
            getQuestionResult[i]['answer_num'] = getAnswerNumResult[0]['count(*)'];
        }
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.BOOK_QUESTION_TAB_SUCCESS, getQuestionResult));
    }
});

module.exports = router;