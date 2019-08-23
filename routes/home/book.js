var express = require('express');
var router = express.Router();
const secret_config = require('../../config/secret');//naver 검색 open api 사용
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

// home/search/book?query=검색어

router.get('/search/book', function (req, res) {
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
      }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                res.end(body);
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
    })   
});

module.exports = router;

