/*
Web Socket: 웹 서버로 소켓을 연결한 후 데이터를 주고 받은 수 있도록 만든 HTML5 표준이다.
웹 브라우저가 이 기능을 지원하지 않아도 Web Socket을 사용할 수 있도록 만든 것이 Socket.io 모듈

모듈: Ajax의 XMLHttpRequest는 보안 문제를 이유로 웹 서비스를 지원하는 서버외에는
다른 서버에서 접속할 수가 없는데 cors(cross origin resource sharing)을 사용하면 제약이 풀림
sop(single oringin policy) 제약을 허용하기 위해서 cors를 사용해서 다른 url간의 자원공유가 가능하다.
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

//다른 서버간 자원공유를 위해서 필요한 cors를 헤더에 자동으로 넣어주는 모듈
const cors = require("cors");


//익스프레스 객체 생성
const app = express();

//템플릿 뷰 엔진 설정
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
console.log("뷰 엔진이 ejs로 설정되었습니다.");

//env(환경변수) 외부에 노출되지 않아야 하는 정보를 모아놓는 곳
app.set("port", process.env.PORT || 3000); //process.env.PORT에 PORT정보가 없으면 2000번으로 설정한다.
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
const server = http.createServer(app).listen(app.get("port"), host, () => {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
  database.init(app, config);
});

const loginID = {};

//Socket.io
const io = require("socket.io")(server);
//console.log(io);
//클라이언트가 웹 소켓으로 접속했을 때 발생하는 가장 기본 이벤트
io.sockets.on('connection', (socket) => {
  console.log('Connect Info: ', socket.request.connection._peername);

  //각각의 클라이언트마다 고유 정보가 있어야함
  //socket.io가 만들어주는 고유정보(socket.id)로 id 만듬

  socket.on('login', function (login) { 
    console.log('login 이벤트를 받았습니다.');
    loginID[login.id] = socket.id;
    console.log('접속한 소켓 id: ' + socket.id);
    socket.loginId = login.id;
    socket.loginAlias = login.alias;

    //console.log('접속한 클라이언트 ID 갯수: ' + Object.keys(loginID).length);

    sendResponse(socket, 'login', '200', socket.loginId +'(' + socket.loginAlias + ')' + '가 로그인 되었습니다.');
    
    console.log('접속한 클라이언트 ID 갯수: ' + Object.keys(loginID).length);
  })

  socket.on('logout', function (logout) {
    
    sendResponse(socket, 'logout', '444', logout.id + '가 로그아웃 되었습니다.');

    delete loginID[logout.id];

  });



  //클라이언트로부터 받은 message 이벤트 처리
  socket.on('message', (message) => {
    console.log('message 이벤트를 받았습니다.');
    console.log(message);

    //나를 포함한 모든 클라이언트에게 메세지를 전달
    if (message.receiver == 'ALL') {
      io.sockets.emit('message', message);
    }
    else { //receiver != 'ALL'
      if (loginID[message.receiver]) {
        //io.to(loginID[message.receiver]).emit('message', message);  //2.0 ver
        io.sockets.connected(loginID[message.receiver]).emit('message', message); //위와 동일한 코드 3.0 ver

        //클라이언트에 응답 메세지 전송
        sendResponse(socket, 'message', '200', message.receiver + '에게 메세지를 전송 했습니다.');
      }
      else {
        sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.');
      }
    }
  });
});

//응답 전용 메세지
const sendResponse = (socket, command, code, message) => {
  const returnMessage = {socket: socket, command: command, code: code , message: message  };
  console.log('여기 에런가?');
  socket.emit('response', returnMessage);
}