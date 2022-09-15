require("dotenv").config(); //외부에서 알면 안되는 정보들

const express = require("express");
const http = require("http");
const serveStatic = require("serve-static");  //특정 폴더 패스로 접근
const path = require("path");
const exp = require("constants");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose'); //몽구스


//익스프레스 객체 생성
const app = express();

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

//데이터베이스 객체
let database = null;

//데이터베이스 스키마
let UserSchema = null;

//데이터베이스 모델(스키마를 컬렉션에 적용)
let UserModel = null;

//데이터베이스 연결
const connectDB = () => {

  //연결 정보
  const databaseUrl = 'mongodb://localhost:27017/shopping';

  //데이터베이스 연결
  mongoose.connect(databaseUrl);

  database = mongoose.connection;

  database.on('open', () => {
    console.log('데이터베이스에 연결 되었습니다.' + databaseUrl);

    //스키마 정의
    UserSchema = mongoose.Schema({
      id: String,
      name:String,
      password:String,
    })
    console.log('UserSchema 정의함');

    //스키마 컬렉션에 적용
    UserModel = mongoose.model('users', UserSchema);
    console.log('UserModel 정의함');
  })
  database.on('error', console.error.bind(console, '몽구스 연결 에러.'));
  
  //DB와 재연결 시도
  database.on('disconnected', () => {
    console.log('DB와 연결이 끊겼습니다. 5초 후 재연결 합니다.');    
    setInterval(() => {
      connectDB();
    }, 5000);
  })
}

//사용자 인증 함수
  const authUser = (id, pwd, callback) => {

  //id, pwd 로 검색
  UserModel.find({ "id": id, "password": pwd }, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    
    if (result.length > 0) {
      callback(null, result);
    }
    else {
      console.log('일치하는 사용자가 없습니다.');
      callback(null, null)
    }
  })
}

//사용자 추가 함수
const addUser = (id, pwd, name, callback) => {
  
  const user = UserModel({"id":id, "password":pwd, "name":name});

  //추가
  user.save((err, result) => {
    
    if (err) {
      callback(err, null);
      return;
    }

    if (result) {
    console.log('사용자 추가됨');
    }
    else {
      console.log('사용자 추가 실패');
    }

    callback(null, result)

  })
  
}

//라우터 객체
const router = express.Router();

router.route('/process/login').post((request, response) => {
  console.log('/process/login 호출됨');
  const id = request.body.id || request.query.id;
  const pwd = request.body.pwd || request.query.pwd;

  if (database) {
    authUser(id, pwd, (err, result) => {
      if (err) throw err;

      if (result) {
        const userName = result[0].name;
        // console.log(userName);
        response.writeHead('200', {'Content-Type':'text/html;charset=utf-8'})
        response.write('<h1>로그인 성공</h1>')
        response.write('<div>사용자 아이디: ' + id + '</div>');
        response.write('<div>사용자 이름: ' + userName + '</div>');
        // response.end("<br/><br/><a href='/public/login.html'>로그인</a>");
      }
      else {
        response.writeHead('200', {'Content-Type':'text/html;charset=utf-8'})
        response.write('<h1>로그인 성공</h1>')
        response.write('<div>아이디와 패스워드가 틀립니다.</div>');
        response.end("<br/><br/><a href='/public/login.html'>로그인</a>");
      }
    })
  }
  else {
    response.writeHead('200', {'Content-Type':'text/html;charset=utf-8'})
    response.write('<h1>데이터베이스 연결 실패</h1>')
    response.write('<div>데이터베이스에 연결하지 못했습니다.</div>');
    response.end();
  }
})
// router.route('/process/logout').get((request, response) => {
  
//   console.log("두두");
//   response.redirect('/process/save')
// })

// router.route('/process/save').get((request, response) => {
  
//   //response.writeHead("200", { "Content-Type": "text/plain;charset=utf-8"});
//   //response.end('하이\n바이');
//   console.log('하이\n바이');
//   response.send ('/public/login.html')

// })

router.route('/process/addUser').post((request, response) => {

  console.log('/process/addUser 호출됨');
  
  const id = request.body.id;
  const pwd = request.body.pwd;
  const name = request.body.name;

  if (database) {
    addUser(id, pwd, name, (err, result) => {
      if (err) throw err;

      if (result) {
        response.writeHead('200', {'Content-Type':'text/html;charset=utf-8'})
        response.write('<h1>사용자 추가 성공</h1>')
        response.write("<br/><br/><a href='/public/login.html'>로그인</a>")
        response.end();
      }
      else {
        response.writeHead('200', {'Content-Type':'text/html;charset=utf-8'})
        response.write('<h1>사용자 추가 실패</h1>')
        response.write("<br/><br/><a href='/public/login.html'>로그인</a>");
        response.end();
      }

    })
    
  }
  else {
    response.writeHead('200', {'Content-Type':'text/html;charset=utf-8'})
    response.write('<h1>데이터베이스 연결 실패</h1>')
    response.write('<div>데이터베이스에 연결하지 못했습니다.</div>');
    response.end();
  }

})

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
  connectDB();
});
