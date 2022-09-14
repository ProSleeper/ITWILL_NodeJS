require("dotenv").config(); //외부에서 알면 안되는 정보들

const express = require("express");
const http = require("http");
const serveStatic = require("serve-static");
const path = require("path");
const exp = require("constants");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

//익스프레스 객체 생성
const app = express();

//env(환경변수) 외부에 노출되지 않아야 하는 정보를 모아놓는 곳
app.set("port", process.env.PORT || 2000); //process.env.PORT에 PORT정보가 없으면 2000번으로 설정한다.
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

//라우터 객체 추가
const router = express.Router();
//app.use((request, response, next) => {

// router와 app의 차이점은 뭔가??????????

router.post("/process/login", (request, response) => {

  console.log("/process/login 호출됨");

  const id = request.body.id;
  const pwd = request.body.pwd;

  if (request.session.user) {
  console.log("이미 로그인되어 상품페이지로 이동합니다.");
    response.redirect('/public/product.html')
    
  }
  else {
    if (id == 'suzi' && pwd == 'a123') {
      //세션저장
      request.session.user = {
        id,
        name: '배수지',
        authorized:true,
      };

      response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
      response.write('<h1>로그인 성공</h1>')
      response.write('<div>id: ' + id + '</div>')
      response.write('<div>pwd: '+ pwd +'</div>')
      response.write('<div>name: '+ request.session.user.name +'</div>')

      response.write("<br/><br/><a href='/process/product'>상품 페이지</a>")
      response.end();
    }
    else {
      console.log('아이디나 패스워드가 틀립니다.');
      response.redirect('/public/login3.html');
    }
  }
});

router.get("/process/product", (request, response) => {
  console.log("/process/product 호출됨");

  if (request.session.user) {
    console.log('로그인 되어있음')
    response.redirect('/public/product.html')
  }
  else {
    console.log('로그인 먼저 하세요');

    response.redirect('/public/login3.html')

  }
});

router.get("/process/logout", (request, response) => {

  console.log("/process/logout 호출됨");

  if (request.session.user) {
    console.log('로그아웃 합니다.')
    // request.session.destroy();
    request.session.destroy((err) => {
      if (err) throw err;

      console.log('세션을 삭제하고 로그아웃 되었습니다.');
      response.redirect('/public/login3.html');
    });
  }
  else {
    console.log('로그인이 되어있지 않습니다.');
    response.redirect('/public/login3.html');

  }

});

app.use("/", router);

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

//Express 서버 시작
http.createServer(app).listen(app.get("port"), () => {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
});
