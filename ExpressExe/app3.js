
require('dotenv').config(); //외부에서 알면 안되는 정보들

const express = require('express');
const http = require('http');
const serveStatic = require('serve-static');
const path = require('path');
const exp = require('constants');
const expressErrorHandler = require('express-error-handler')

//익스프레스 객체 생성
const app = express();

//env(환경변수) 외부에 노출되지 않아야 하는 정보를 모아놓는 곳
app.set('port', process.env.PORT || 2000);  //process.env.PORT에 PORT정보가 없으면 2000번으로 설정한다.
//OR연산이므로 ||을 기준으로 왼쪽이 true면 오른쪽은 실행을 하지 않으므로 PORT에 정보가 있으면 설정된 PORT번호로 지정되고
//왼쪽이 false면 오른쪽을 실행해서 2000을 포트번호로 사용한다.

//미들웨어
//application/x-www-form-urlencoded : false
app.use(express.urlencoded({ extended: false })); //false로 하면 html파일에서 form 에서의 enctype="application/x-www-form-urlencoded"과 같은 의미 이다.

//json 데이터 파싱
app.use(express.json());
//path.join(__dirname, 'public') << 크롤링 코드에 적용하자 path부분
app.use('/public',serveStatic(path.join(__dirname, 'public'))); //상대경로 설정
//앞의 /public은 가상의 주소 뒤의 /public 은 실제 주소


//라우터 객체 추가
const router = express.Router();
//app.use((request, response, next) => {

// router와 app의 차이점

//router.route('/process/login').post((request, response) => {})
router.post('/', (request, response, next) => {
//미들웨어

  console.log('첫번째 미들웨어에서 요청을 처리함');
 
  //response.redirect('/login.html')  //login.html로 리다이렉트 시킴
  const paramName = request.body.id || request.query.id;
  const paramPwd = request.body.pwd || request.query.pwd;

  response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
  response.write('<h1>Express가 서버에서 응답한 결과 입니다.</h1>');
  response.write('<div>ID: ' + paramName + '</div>');
  response.write('<div>PWD: ' + paramPwd + '</div>');
  response.write("<br/><br/><a href='/public/login2.html'>로그인</a>");
  response.end();

})

app.use('/', router);

const errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
})

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// app.use("/", (request, response, next) => {
//   console.log('두번째 미들웨어에서 요청을 처리함');
//   response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
//   response.end('<h1>' + request.user + '가 응답한 응답한 결과 입니다.</h1>');
// })

//Express 서버 시작
http.createServer(app).listen(app.get('port'),() => {
  console.log('익스프레스 서버를 시작했습니다: ' + app.get('port'));
});





