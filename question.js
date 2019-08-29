var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

//질문 등록하기
router.post('/', async(req, res) => {
  try{
    const { body } = req         

    if (!body.question_content || !body.userIdx || !body.bookIdx){
      res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.QUESTION_UPLOAD_FAIL));
    } else {
        const insertQuestionQuery = `
        INSERT INTO
          question(question_content, userIdx, bookIdx)
        VALUES
          (?, ?, ?) 
        `
        const questionRegisterResult = await db.queryParam_Parse(insertQuestionQuery, [ body.question_content, body.userIdx, body.bookIdx] );

        res.status(200).send(util.successTrue(statusCode.OK, resMessage.QUESTION_UPLOAD_SUCCESS, questionRegisterResult));
        console.log(questionRegisterResult);
        }
        }catch(err){
          console.log(err);
        }
});

//질문 등록 화면
router.get('/', async(req, res) => {
  try{
      const { bookIdx } = req.query
      
      const selectBookInfoQuery = `
      SELECT
        title, book_image, author
      FROM
        book 
      WHERE
        bookIdx = ?
      `
      const bookInfoResult = await db.queryParam_Parse( selectBookInfoQuery, [ bookIdx ] );
      console.log(bookInfoResult);

        if (bookInfoResult == 0){
            res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.QUESTION_VIEW_FAIL));
        } else {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.QUESTION_VIEW_SUCCESS, bookInfoResult));
        }
      
  }catch(err){
      console.log(err);
  }
}) 

module.exports = router;