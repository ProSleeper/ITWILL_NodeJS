require("dotenv").config(); //외부에서 알면 안되는 정보들

const express = require("express");
const http = require("http");
const serveStatic = require("serve-static"); //특정 폴더 패스로 접근
const path = require("path");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// const MongoClient = require('mongodb').MongoClient;
// const mongoose = require("mongoose"); //몽구스
const user = require('./router/user');
const config = require('./config');
const database = require('./database/database');
const routerLoader = require('./router/routerLoader')



//익스프레스 객체 생성
const app = express();

//템플릿 뷰 엔진 설정
app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
// console.log('뷰 엔진이 ejs로 설정되었습니다.');
app.set('view engine', 'jade');
console.log('뷰 엔진이 jade로 설정되었습니다.');


//env(환경변수) 외부에 노출되지 않아야 하는 정보를 모아놓는 곳
app.set("port", process.env.PORT || config.serverPort); //process.env.PORT에 PORT정보가 없으면 2000번으로 설정한다.
//OR연산이므로 ||을 기준으로 왼쪽이 true면 오른쪽은 실행을 하지 않으므로 PORT에 정보가 있으면 설정된 PORT번호로 지정되고
//왼쪽이 false면 오른쪽을 실행해서 2000을 포트번호로 사용한다.

//미들웨어
//application/x-www-form-urlencoded : false
app.use(express.urlencoded({ extended: false })); //false로 하면 html파일에서 form 에서의 enctype="application/x-www-form-urlencoded"과 같은 의미 이다.

//json 데이터 파싱
app.use(express.json());
//path.join(__dirname, 'public') << 크롤링 코드에 적용하자 path부분
app.use("/public1", serveStatic(path.join(__dirname, "public1"))); //상대경로 설정
//앞의 /public은 가상의 주소 뒤의 /public 은 실제 주소

//쿠키 미들웨어
app.use(cookieParser());

//세션 설정
app.use(
  expressSession({
    secret: "my key", //쿠키를 임의로 변조하는 것을 방지
    resave: true, //세션을 항상 저장할지 선택
    saveUninitialized: true, //세션을 만들고 만든 세션이 변경되지 않게끔 하는 옵션
  })
);

//라우터 객체
//const router = express.Router();

//routerLoader.init(app, router);

routerLoader.init(app, express.Router());


// router.route("/").get((request, response) => {
//   console.log("접속 호출됨");
//   response.sendFile(`${__dirname}/public/login.html`);
// });

// router.route("/process/join").get((request, response) => {
//   console.log("회원가입 호출됨");
//   response.sendFile(`${__dirname}/public/addUser.html`);
// });


const errorHandler = expressErrorHandler({
  static: {
    404: "./public1/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// app.use("/", (request, response, next) => {
//   console.log('두번째 미들웨어에서 요청을 처리함');
//   response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
//   response.end('<h1>' + request.user + '가 응답한 응답한 결과 입니다.</h1>');
// })

//Express 서버 시작
const host = '192.168.16.6';
http.createServer(app).listen(app.get("port"), host, () => {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
  database.init(app, config);
});








