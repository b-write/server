var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

router.get('/:questionIdx', async(res, req) => {

	try{
		const { questionIdx } = req.query

		if(!questionIdx){
			res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.MY_QUESTION_LIST_FAIL));
		} else{
			const selectMyQuestionListQuery = 
			`
			SELECT
				b.title, b.book_image, b.author, q.question_content, q.question_date, q.question_likes
			FROM
				book b, user u, question q
			WHERE
				q.userIdx = u.userIdx and q.bookIdx = b.bookIdx and u.userIdx = ?
			`

			const selectMyQuestionLikesQuery = 
			`
			SELECT
				count(*)
			FROM
				answer a, question q
			WHERE
				a.questionIdx = q.questionIdx and a.question = ?
			`
			const myQuestionListResult = await db.queryParam_Parse(selectMyQuestionListQuery, [ questionIdx ]);
			res.status(200).send(util.successTrue(statusCode.OK, resMessage.MY_QUESTION_LIST_SUCCESS, myQuestionListResult));
			console.log(myQuestionListResult);
		}

	}catch(err){
		console.log(err);
	}

})


module.exports = router;