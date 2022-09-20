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
const config = require("./config");
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

//홈화면 조회
router.route('/').get((request, response) => {
  response.render('index.ejs');
})
  
//로그인 화면 조회
router.route('/login').get((request, response) => {
  response.render('login.ejs', {message:request.flash('loginMessage')});
});

//로그인 요청
router.route('/login').post(passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

//회원가입조회
router.route('/signup').get((request, response) => {
  response.render('signup.ejs', {message:request.flash('signupMessage')})
});

//회원가입요청
router.route('/signup').post(passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

//사용자 프로필
router.route('/profile').get((request, response) => {
  console.log(request.user);

  //인증이 안된 경우
  if (!request.user) {
    console.log('사용자 인증이 안된 상태임');
    response.redirect('/');
    return;
  }
  console.log('사용자 인증된 상태임');

  if (Array.isArray(request.user)) {
    response.render('profile.ejs', { user: request.user[0]._doc });
  }
  else {
    response.render('profile.ejs', { user: request.user });
  }

});

//로그아웃요청	
router.route('/logout').get((request, response) => {
  console.log('로그아웃boom!!');
  request.logout((err) => {
    if (err) throw err;
  });
  response.redirect('/');
})


//로그인 추가
//Passport Strategy 설정

//인증방식의 객체를 설정
const LocalStrategy = require('passport-local').Strategy;
// const LocalStrategy = require("passport.local").Strategy;

//패스포트 로그인 설정
//use(이름, 인증방식 객체) - 이름은 함수 구별 용도
//done() 메서드는 예약어
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd",
      passReqToCallback: true, //아래 콜백함수의 첫번째 파라미터로 request객체에 전달됨
    },
    (request, email, pwd, done) => {
      const database = app.get("database");
      database.UserModel.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log("등록된 계정이 없습니다.");
          //검증 콜백에서 두번째 파라미터의 값을 false로 해서 인증 실패한 것으로 처리
          return done(null, false, request.flash("loginMessage", "등록된 계정이 없습니다."));
        }

        const authenticated = user.authenticate(pwd, user._doc.salt, user._doc.hashed_password);

        if (!authenticated) {
          console.log("비밀번호가 일치하지 않음");

          return done(null, false, request.flash("loginMessage", "비밀번호가 일치하지 않습니다."));
        }

        console.log("비밀번호가 일치함");
        return done(null, user);
      });
    }
  )
);

//패스포트 회원가입 설정
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd",
      passReqToCallback: true,
    },
    (request, email, pwd, done) => {
      //요청 파라미터
      const name = request.body.name;

      console.log(`${email},${pwd},${name}`);

      process.nextTick(() => {
        const database = app.get("database");
        database.UserModel.findOne({ email: email }, (err, user) => {
          if (err) {
            return done(err);
          }

          //회원가입이 되어있는 경우
          if (user) {
            console.log("회원가입이 되어있습니다.");
            return done(null, false, request.flash("signupMessage", "회원가입이 되어있습니다."));
          } else {
            const user = new database.UserModel({ email: email, password: pwd, name: name });
            user.save((err) => {
              if (err) throw err;
              console.log("사용자 데이터 추가함");
              return done(null, user);
            });
          }
        });
      });
    }
  )
);

//routerLoader.init(app, express.Router());

//사용자의 인증 성공시 호출
//사용자 정보를 이용해서 세션을 만듬
passport.serializeUser((user, done) => {
  console.log("serializeUser 호출됨");
  console.log(user);

  done(null, user); //user 객체를 이용해서 세션을 생성
});

//사용자 인증 후 사용자 요청시마다 호출
passport.deserializeUser((user, done) => {
  console.log("deserializeUser 호출됨");

  //사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회가 필요
  //user객체 전체를 passport에서 관리
  //사용자 정보는 request.user 객체로 사용됨
  done(null, user);
});

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
