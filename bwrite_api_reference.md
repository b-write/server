BaseUrl =>  <b>host:port/api</b>

## 나의 질문 리스트 가져오기

url : /write/myQuestionList

method : GET

header : token

> response

```java
성공 = 200
result:
{
    "status": 200,
    "success": true,
    "message": "나의 질문 리스트 가져오기 성공",
    "data": [
        [
            {
                "questionCount": 2
            }
        ],
        {
            "title": String,
            "book_image": String,
            "author": String,
            "question_content": String,
            "question_date": String,
            "question_likes": int,
            "answerCount": int
        },
        .
        .
        .      
    ]
}

실패 
- 내부 서버 오류 : 500
```



## 질문 등록 화면 가져오기

url : /write/question/:bookIdx

method : GET

header : token

> response

```java
성공 = 200
result:
{
    "status": 200,
    "success": true,
    "message": "질문 등록 화면 가져오기 성공",
    "data": [
        {
            "title": String,
            "book_image": String,
            "author": String
        }
    ]
}

실패
result:
{
    "status": 204,
    "success": false,
    "message": "질문 등록 화면 가져오기 실패"
}
```

