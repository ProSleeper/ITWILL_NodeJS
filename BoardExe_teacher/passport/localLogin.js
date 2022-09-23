
//인증방식 모듈
var LocalStrategy = require("passport-local").Strategy;

//패스포트 로그인 설정
module.exports = new LocalStrategy({

	usernameField:"email",
	passwordField:"pwd",
	
	//아래 콜백함수의 첫번째 인수로 req 객체를 전달
	passReqToCallback : true
	
	},function(req, email, pwd, done){
		
		//데이터베이스 객체
		var database = req.app.get("database");
		
		database.UserModel.findOne({"email":email},function(err,user){					
		
			if(!user){ //등록된 사용자가 없는경우
				
				//검증 콜백에서 두번째 인수값을 false로 하면 
				//인증 실패한것으로 처리
				return done(null,false,
						req.flash("loginMessage","등록된 계정이 없습니다."));
						
			}
			
			//비밀번호가 맞지 않는경우
			var authenticated = 
				user.authenticate(pwd,user._doc.salt, user._doc.hashed_password);
			
			if(!authenticated){
				
				return done(null,false,
						req.flash("loginMessage","비밀번호가 일치하지 않습니다"));				
				
			}
		
			//email,pwd 일치
			return done(null,user);
		
	});	

});
