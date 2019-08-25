var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

//답변 등록하기
router.post('/', async(req, res) => {
  try{
		const { body } = req        

    if (!body.answer_content || !body.userIdx || !body.questionIdx || !body.bookIdx){
      res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.ANSWER_UPLOAD_FAIL));
    } else {
        const insertAnswerQuery = `
        INSERT INTO
          answer(answer_content, userIdx, questionIdx, bookIdx)
        VALUES
          (?, ?, ?, ?) 
        `
        const answerRegisterResult = await db.queryParam_Parse(insertAnswerQuery, [ body.answer_content, body.userIdx, body.questionIdx, body.bookIdx] );

        res.status(200).send(util.successTrue(statusCode.OK, resMessage.ANSWER_UPLOAD_SUCCESS, answerRegisterResult));
        console.log(questionRegisterResult);
        }
        }catch(err){
          console.log(err);
        }
});

//답변 등록 화면
router.get('/:questionIdx', async(req, res) => {
	try{		
		const {questionIdx} = req.query

		const selectAnswerViewQuery = `
		SELECT
			q.question_content, b.title, b.author, b.book_image
		FROM
			book b, question q, answer a
		WHERE
			b.bookIdx = a.bookIdx and q.questionIdx = a.questionIdx and q.questionIdx = ?
		`
		const answerViewResult = await db.queryParam_Parse(selectAnswerViewQuery, [ questionIdx ]);
		res.status(200).send(util.successTrue(statusCode.OK, resMessage.ANSWER_VIEW_SUCCESS, answerViewResult));
    console.log(answerViewResult);

	}catch(err){
		console.log(err);
	}
})


module.exports = router;