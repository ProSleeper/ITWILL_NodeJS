
var express = require('express');
var http = require('http');

//Express 객체 생성
var app = express();

app.set('port', process.env.PORT || 3000);//process: 환경변수. 환경변수안에 PORT가 있으면 port를 넣고, 없으면 3000을 넣어라

//미들웨어
app.use(function(req,res,next) {
	
	console.log('첫번째 미들웨어에서 요청을 처리함');

	req.user = 'soo';
	
	next();
	
});

app.use('/', function(req,res,next) {//'/': 요청 주소
	
	console.log('두번째 미들웨어에서 요청을 처리함');
	res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'});
//	res.end('<h1>Express Server에서 응답한 결과입니다.</h1>');
	res.end('<h1>Express Server에서 ' + req.user + '가 응답한 결과입니다.</h1>');
});

//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server를 시작했습니다 : ' + app.get('port'));
});

/*.
	1.
	res.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
	이 부분이 정확히 말하는 바는 무엇인가?
  request 요청인지 response 요청인지

	2. app과 route는 무엇이 다른가?

	3. next는 어떻게 다음 요청을 부르는건지? 순서가 어떻게 되는건지?

	4. 이 코드의 의미는 정확히 무엇인가?
	app.use('/public',serveStatic(path.join(__dirname, 'public')));
	'./public/404.html' <- 이건 의미가 있는건가?

	5. 이 코드는 제일 밑에 사용하는 이유는 위에서 모든 설정들을 적용하고 서버가 실행하라고 하는 것인가?
	http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server를 시작했습니다 : ' + app.get('port'));
	});

*/
