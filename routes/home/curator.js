var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

router.get('/:name', async(req, res) => {
    try{
        // const curator = req.params.curatorIdx;
        const getCuratorQuery = 'SELECT name, job, curator_image, recommend, curator_intro, title, author FROM curator JOIN book ON curator.bookIdx = book.bookIdx WHERE curator.name = ?';
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

module.exports = router;