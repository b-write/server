var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const authUtil = require('../../module/authUtils');
const jwt = require('../../module/jwt');
const moment = require('moment')


//나의 질문 함
router.get('/', authUtil.isLoggedin, async(req, res) => {
	try{

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
				count(*) AS answerCount
			FROM
				user u, question q, answer a
			WHERE
				u.userIdx = q.userIdx and
				a.questionIdx = q.questionIdx and
				u.userIdx = ?
			GROUP BY
				q.questionIdx
			`

			const selectQuestionCountQuery = 
			`
			SELECT
				count(*) AS questionCount
			FROM
				question
			WHERE
				userIdx = ?
			`

			let myQuestionLikesResult = null;
			let myQuestionListResult = null;
			let questionCountResult = null;

			const selectTransaction = await db.Transaction(async(connection) => {				
				myQuestionListResult = await db.queryParam_Parse(selectMyQuestionListQuery, [ req.decoded.idx ]);
				myQuestionLikesResult = await db.queryParam_Parse(selectMyQuestionLikesQuery, [ req.decoded.idx ]);
				questionCountResult = await db.queryParam_Parse(selectQuestionCountQuery, [req.decoded.idx]);
			});

			if(selectTransaction == 0){
				res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.My_QUESTION_LIST_FAIL));
			}else{
				const questionResult = [];

				questionResult.push(questionCountResult);
			
				for(let i = 0; i < myQuestionListResult.length; i++){
					questionResult.push({			
					title : myQuestionListResult[i].title,
					book_image : myQuestionListResult[i].book_image,
					author : myQuestionListResult[i].author,
					question_content : myQuestionListResult[i].question_content,
					question_date : moment(myQuestionListResult[i].question_date).add(9, 'hours').format('YYYY.MM.DD'),
					question_likes : myQuestionListResult[i].question_likes,
					answerCount : myQuestionLikesResult[i].answerCount
					})
				}
				res.status(200).send(util.successTrue(statusCode.OK, resMessage.MY_QUESTION_LIST_SUCCESS, questionResult));
				console.log(questionResult);
			
		}
	}catch(err){
		console.log(err);
	}
})

//나의 질문 수정하기
router.put('/', authUtil.isLoggedin, async(req, res) => {
	try{

		const { body } = req

		if ( !body.questionIdx ){
			res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.MY_QUESTION_MODIFY_FAIL));
		}else{
			const updateMyQuestionQuery = 
			`
			UPDATE
				question
			SET
				question_content = ?
			WHERE
				questionIdx = ? and userIdx = ?
			`

			const modifyMyQuestionResult = db.queryParam_Parse(updateMyQuestionQuery, [ body.question_content, body.questionIdx, req.decoded.idx ]);
			
			if (modifyMyQuestionResult.changedRows == 0){
				res.status(200).send(util.successFalse(statusCode.UNAUTHORIZED, resMessage.MY_QUESTION_MODIFY_FAIL));
			}else{
				res.status(200).send(util.successTrue(statusCode.OK, resMessage.MY_QUESTION_MODIFY_SUCCESS));
			}
	}
	}catch(err){
		console.log(err);
	}
})


module.exports = router;