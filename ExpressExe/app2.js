const express = require('express');
const http = require('http');

    //익스프레스 객체 생성
    const app = express();

    app.set('port', process.env.PORT || 3000);

    //미들웨어
    app.use((request, response, next) => {
      console.log('첫번째 미들웨어에서 요청을 처리함');
      //response.send({ name: '수지', age: 27 });

      //response.status(403).send("접근금지!!")
      //response.sendStatus(403);
      //response.redirect('https://m.naver.com')

      const userAgent = request.header('User-Agent');  //브라우저 정보
      let paramName = request.query.name; //Get방식
      //paramName = request.body.name;      //Post방식
  //paramName = request.param('name');  //Get, Post 방식

  response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
  response.write('<h1>Express가 서버에서 응답한 결과 입니다.</h1>');
  response.write('<div>User-Agent: ' + userAgent + '</div>');
  response.write('<div>name: ' + paramName + '</div>');
  response.end();



})

// app.use("/", (request, response, next) => {
//   console.log('두번째 미들웨어에서 요청을 처리함');
//   response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
//   response.end('<h1>' + request.user + '가 응답한 응답한 결과 입니다.</h1>');
// })

//Express 서버 시작
http.createServer(app).listen(app.get('port'),() => {
  console.log('익스프레스 서버를 시작했습니다: ' + app.get('port'));
});



