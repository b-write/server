var express = require('express');
var router = express.Router();
const secret_config = require('../../config/secret');//naver 검색 open api 사용
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

// home/search/book?query=검색어
//author_intro없어,,,

router.get('/search/book', function(req, res) {
    var request = require('request');
    var options = {
        display : 1
    };

    request.get({
        uri: 'https://openapi.naver.com/v1/search/book.json?query=' + encodeURI(req.query.query),
        qs : options,
        headers:{
          'X-Naver-Client-Id':secret_config.federation.naver.client_id,
          'X-Naver-Client-Secret':secret_config.federation.naver.client_secret
        }
      }, async function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                // // res.end(body);
                var json = JSON.parse(body);
                var title_tag = (json['items'][0])['title']//title에 tag있는 상태
                var title = title_tag.replace(/(<b>|<\/b>)/gi, "");//title에 tag없는 상태
                var book_image = (json['items'][0])['image'];
                var author = (json['items'][0])['author'];
                var summary_tag = (json['items'][0])['description'];
                var summary = summary_tag.replace(/(<b>|<\/b>)/gi, "");
                var publisher = (json['items'][0])['publisher'];
                const insertBookQuery = 'INSERT INTO book (title, publisher, author, summary, book_image) VALUES (?, ?, ?, ?, ?)';
                const insertBookResult = await db.queryParam_Parse(insertBookQuery, [title , publisher, author, summary, book_image]);
                const book_result=[];
                var book_json = new Object();
                book_json.title = title;
                book_json.publisher = publisher;
                book_json.author = author;
                book_json.summary = summary;
                book_json.book_image = book_image;
                book_result.push(book_json);
                if(insertBookResult.length == 0){//실패
                    res.status(200).send(util.successFalse(statusCode.OK, resMessage.BOOK_INSERT_FAIL));
                }else{
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.BOOK_INSERT_SUCCESS, book_result));
                }
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
    })   
});

module.exports = router;

