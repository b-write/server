//다 읽었어요 버튼
var express = require('express');
var router = express.Router();

//클라이언트한테 토큰 받아서 userIdx로 
//finish table에 특정 userIdx가 없는데 이벤트가 발생했으면 그 userIdx를 finish table에 넣어준다.
//finish table에 특정 userIdx가 있는데 이벤트가 발생했으면 그 userIdx를 finish table에서 삭제한다.

router.get('/:bookIdx', async(req, res)=>{//다 읽었어요 누르는 이벤트

});


module.exports = router;