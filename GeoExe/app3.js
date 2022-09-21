/*
* 위치기반 서비스 서버 만들기(LBS : Location Based Service)

특정 위치의 정보를 제공하고 조회하는 방법을 데이터베이스에서 
대부분 제공. 몽고디비도 기능을 제공

1. 스타벅스의 위치정보 확인(이름,전화번호,위치 경도)
2. 스타벅스의 위치정보 저장
3. 스타벅스을 위치로 조회

* 위치정보는 사람의 이름과 같은 문자열을 저장하는 것과 다르게 
  경도와 위도를 사용
* 위치정보를 저장하거나 조회할때는 공간 인덱싱(Spatial Indexing)이란 방법으로
  경도와 위도의 좌표를 인덱스로 만들어 조회속도를 높임
* 몽고디비에서는 GeoSpatial Indexing 이라 함

* 조회방법
	1. 사용자 위치에서 가장 가까운 스타벅스(near)
	2. 사용자가 보고있는 지도 범위 안의 스타벅스(within)
	3. 사용자가 있는 곳에서 일정 반경 안에 있는 스타벅스(circle)

* 위치 데이터 종류
	1. Point : 현재위치나 스타벅스의 위치같은 특정한 지점
	2. LineString : 도로와 같이 이어진 위치
3. Polygon: 청담동, 역삼동 같은 지역
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
