

var localLogin = require("./localLogin");
var localSignup = require("./localSignup");

module.exports = function(app,passport){
	
	console.log("passport.js 호출");
	

	//사용자 인증 성공시 호출
	//사용자 정보를 이용해서 세션을 만듬
	passport.serializeUser(function(user,done){
		console.log("serializeUser 호출");
		console.log(user);
		
		done(null,user);//이 인증을 콜백에서 넘겨주는 user객체정보로 세션 생성
	});

	//사용자 인증 이후 사용자 요청시마다 호출
	//user:사용자 인증 성공시 serializeUser메소드를 이용해 만든 세션정보가 파라미터로 넘어옴
	passport.deserializeUser(function(user,done){
		console.log("deserializeUser 호출");
		console.log(user);
		
		//사용자 정보중에 id나 email만 있는 경우 사용자 정보 조회가 필요
		//여기서는 user객체 전체를 패스포트에서 관리
		//두번째 파라미터로 지정된 사용자 정보는 req.user객체로 복원됨	
		done(null,user);
		
	});


	//인증방식 설정
	passport.use("local-login",localLogin);
	passport.use("local-signup",localSignup);
	
	
}


