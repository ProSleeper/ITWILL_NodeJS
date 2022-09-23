//게시판 만들기

var express = require("express");
var http = require("http");
var path = require("path");

var serveStatic = require("serve-static")
var expressErrorHandler = require("express-error-handler");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var passport = require("passport");
var flash = require("connect-flash");//메세지 전달

//config.js 모듈
var config = require("./config/config");

//database.js 모듈
var database = require("./database/database");

//routerLoader.js 모듈
var routerLoader = require("./router/routerLoader");

//익스프레스 객체 생성
var app = express();
app.set("port",process.env.PORT || config.serverPort);

//뷰엔진 설정
app.set("views",__dirname + "/views");
app.set("view engine","ejs");
console.log("뷰 엔진은 ejs로 설정되었습니다.");


//미들웨어 추가
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/public",serveStatic(path.join(__dirname,"public")));


app.use(expressSession({
	secret:"my key",
	resave:true,
	saveUninitialized:true	
}));

//Passport 사용
//Passport의 두개의 함수를 호출했을때 반환하는 객체를 미들웨어로 등록
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var router = express.Router();
routerLoader.init(app,router);

//패스포트 설정
var configPassport = require("./passport/passport");
configPassport(app, passport);

//패스포트 라우팅 설정
var userPassport = require("./router/userPassport");
userPassport(router, passport);


//404에러 페이지
var errorHandler = expressErrorHandler({
	
	static:{
		'404' : "./public/404.html"
	}
	
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//에러가 나도 서버가 종료되는것을 방지
process.on("uncaughException", function(err){
	
	console.log("서버프로세스 종료하지 않고 유지함.");
});


//Express서버 시작
var host = "192.168.16.6";

http.createServer(app).listen(app.get("port"),host,function(){
	
	console.log("Express 서버를 시작했습니다 : " + app.get("port"));
	
	//데이터베이스 초기화
	database.init(app,config);
	
});



