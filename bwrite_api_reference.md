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

## 질문 등록하기

url : /write/question

method : POST

header : 

> body

```java
{
    question_content: "String",
    userIdx: int,
    bookIdx: int
}
```

> response

```java
성공 = 200
{
    "status": 200,
    "success": true,
    "message": "질문 등록 성공",
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 16,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}

실패 
- body값에 NULL값이 있을 때
{
    "status": 204,
    "success": false,
    "message": "질문 등록 실패"
}

```

## 답변 등록 화면

url : /write/answer/:questionIdx

method: GET

header: token

> response

```java
성공 = 200
result:
{
    "status": 200,
    "success": true,
    "message": "답변 등록 화면 불러오기 성공",
    "data": [
        {
            "question_content": String,
            "title": String,
            "author": String,
            "book_image": String
        }
    ]
}


실패
{
    "status": 204,
    "success": false,
    "message": "답변 등록 화면 가져오기 실패"
}

```

## 답변 등록하기

url : /write/answer

method : POST

header : token

> body

```java
{
	answer_content : "String",
	userIdx : int,
	questionIdx : int,
	bookIdx : int
}
```

> response

```java
성공 = 200
{
    "status": 200,
    "success": true,
    "message": "답변 등록 성공",
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 9,
        "serverStatus": 2,
        "warningCount": 1,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}

실패
-body에 NULL값 존재
{
    "status": 204,
    "success": false,
    "message": "답변 등록 실패"
}
```

