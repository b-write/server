var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const authUtil = require('../../module/authUtils');


router.get('/', authUtil.isLoggedin, async(req, res) => {
	try{

		const selectDailyQuestionQuery = 
		`
		SELECT
			q.question_content, b.title, b.author
		FROM
			finishlist f, question q, user u, book b
		WHERE
			u.userIdx = f.userIdx and f.bookIdx = q.bookIdx and f.bookIdx = b.bookIdx and u.userIdx = ?
		ORDER BY
			rand() limit 1;
		
		`

		const selectUserFinishListQuery = 
		`
		SELECT
			b.title, b.author, b.publisher, b.book_image
		FROM
			user u, book b, finishlist f
		WHERE
			f.userIdx = u.userIdx and f.bookIdx = b.bookIdx and u.userIdx = ?
		`

		let dailyQuestionResult = null;
		let userFinishListResult = null;

		const selectTransaction = await db.Transaction(async(connection) => {
			dailyQuestionResult = await db.queryParam_Parse(selectDailyQuestionQuery, [ req.decoded.idx ]);
			userFinishListResult = await db.queryParam_Parse(selectUserFinishListQuery, [req.decoded.idx]);
		});
		if(selectTransaction == 0){
			res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.My_QUESTION_LIST_FAIL));
		}else{
			const questionResult = [];
			questionResult.push(dailyQuestionResult, userFinishListResult);
			res.status(200).send(util.successTrue(statusCode.OK, resMessage.MY_QUESTION_LIST_SUCCESS, questionResult));
		}
		

	}catch(err){
		console.log(err);
	}
})


module.exports = router;