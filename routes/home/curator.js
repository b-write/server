var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const authUtil = require("../../module/authUtils");

//postman에서 잘 안됨...한글때문?
router.get('/:name', async(req, res) => {
    try{
        // const curator = req.params.curatorIdx;
        const getCuratorQuery = 'SELECT name, job, title, author, book_image FROM curator JOIN book ON curator.bookIdx = book.bookIdx WHERE curator.name = ?';
        const getCuratorResult = await db.queryParam_Parse(getCuratorQuery, [req.params.name]);

            if (getCuratorResult == 0) { 
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.CURATOR_SELECT_FAIL));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.CURATOR_SELECT_SUCCESS,getCuratorResult));
                console.log(getCuratorResult);
            }
        }catch(err){
            console.log(err);
        }
});

router.get('/:name/:bookIdx', async(req, res) => {
    try{
        const getCuratorQuery = 'SELECT name, job, recommend, title, author, book_image FROM curator JOIN book ON curator.bookIdx = book.bookIdx WHERE curator.name = ? AND curator.bookIdx = ?';
        const getCuratorResult = await db.queryParam_Parse(getCuratorQuery, [req.params.name, req.params.bookIdx]);
        // const getWishQuery = 'SELECT * FROM wishlist WHERE userIdx = ? AND bookIdx = ?';
        // getWishResult = await db.queryParam_Parse(getWishQuery, [req.decoded.idx, req.params.bookIdx]);
        console.log(getCuratorResult);
            if (getCuratorResult.length == 0) { //wish값 0
                // getCuratorResult[0]['wish'] = 0;
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.CURATOR_SELECT_FAIL));//그냥 delete fail
            } else {//wish값 1
                // getCuratorResult[0]['wish'] = 1;
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.CURATOR_SELECT_SUCCESS, getCuratorResult));
            }
        }catch(err){
            console.log(err);
        }
});

module.exports = router;