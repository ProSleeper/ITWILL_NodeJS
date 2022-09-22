/*
RPC(Remote Procedure Call)는 서버에 데이터를 요청하여 응답받는 과정을 
라이브러리에서 자동으로 처리합니다 로컬단말에서 함수를 호출하는것처럼 
코드를 만들기만 해도 클라이언트와 서버간에 데이터를 주고 받을수 있음
이방법을 사용하면 서버를 훨씬 쉽고 간단하게 만들수 있음. 
오라클의 프로시져와 비슷한 기능

Ajax를 Jquery로 구현하는 방법과 유사

JSON-RPC 서버는에서
쉽게 사용이 가능함.

즉 서버에 함수를 만들어 놓고 클라이언트에서 호출하거나 응답 받는 과정을 
모두 라이브러리(RPC)에서 담당하면 복잡한 네트워크 과정을 신경쓰지 않아도 됨
	
	[처리 과정]
	1. 웹 서버에 add함수를 만듬
	2. 클라이언트의 웹 문서에서 add함수를 호출
	3. 라이브러리에서는 스텁(Stub)을 통해 서버로 요청을 보냄
	4. 서버에서는 add함수를 실행하고 그 결과값을 응답 보내줌
	5. 개발자는 클라이언트와 서버간에 어떤 데이터를 어떻게 주고 받는지
		신경 안써도 됨(데이터 포맷은 XML,바이너리) 

스텁(Stub) : RPC서버에서 요청과 처리를 함
핸들러(Handler) : JSON-RPC를 사용하기 위해 등록한 각 함수
*/

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
//const user = require('./router/user');
const config = require("./config/config");
const database = require("./database/database");
const routerLoader = require("./router/routerLoader");
const passport = require("passport");
const flash = require("connect-flash");


//JsonRpc 모듈
const handlerLoader = require('./handler/handlerLoader');

//JsonRpc 사용을 위해 jayson
const jayson = require('jayson');




//익스프레스 객체 생성
const app = express();

//템플릿 뷰 엔진 설정
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
console.log("뷰 엔진이 ejs로 설정되었습니다.");

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
app.use("/public", serveStatic(path.join(__dirname, "public"))); //상대경로 설정
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

//passport의 두개의 함수를 호출했을 때 반환하는 객체
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//라우터 객체
const router = express.Router();

routerLoader.init(app, router);

/*
클라이언트요청	웹서버		뷰템플릿

홈화면조회	/(get)		홈화면(index.ejs)
로그인화면조회	/login(get)	로그인화면(login.ejs)
로그인요청	/login(post)	로그인처리(함수)
회원가입조회	/signup(get)	회원가입화면(signup.ejs)
회원가입요청	/signup(post)	회원가입처리(함수)
사용자프로필	/profile(get)	프로필화면(profile.ejs)
로그아웃요청	/logout(get)	로그아웃처리(함수)
*/


// 패스포트 라우터 설정
const userPassport = require('./router/userPassport');
userPassport(router, passport);

//로그인 추가
//Passport Strategy 설정

const configPassport = require('./passport/passport')
configPassport(app, passport)

//routerLoader.init(app, express.Router());

// router.route("/").get((request, response) => {
//   console.log("접속 호출됨");
//   response.sendFile(`${__dirname}/public/login.html`);
// });

// router.route("/process/join").get((request, response) => {
//   console.log("회원가입 호출됨");
//   response.sendFile(`${__dirname}/public/addUser.html`);
// });



//jayson 미들웨어

//JSON-RPC 핸들러 정보를 읽어서 핸들러 설정
const jsonrpc_api_path = config.jsonrpc_api_path;
handlerLoader.init(jayson, app, jsonrpc_api_path);

console.log('JSON-RPC를 [' + jsonrpc_api_path + ']패스에서 사용하도록 설정');






const errorHandler = expressErrorHandler({
  static: {
    404: "./public/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// app.use("/", (request, response, next) => {
//   console.log('두번째 미들웨어에서 요청을 처리함');
//   response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
//   response.end('<h1>' + request.user + '가 응답한 응답한 결과 입니다.</h1>');
// })

process.on('uncaughtException', (err) => {
  console.log('서버 프로세스 종료하지 않고 유지함');
})




//Express 서버 시작
const host = "192.168.16.6";
http.createServer(app).listen(app.get("port"), host, () => {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
  database.init(app, config);
});
