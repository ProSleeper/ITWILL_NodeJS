
//인증방식 모듈
var LocalStrategy = require("passport-local").Strategy;

//패스포트 회원가입 설정
module.exports = new LocalStrategy({

	usernameField:"email",
	passwordField:"pwd",
	passReqToCallback : true	
	
	},function(req,email,pwd,done){
		
		var name = req.body.name;
		
		//findOne 메소드가 blocking이 되지 않게 async방식으로 변경
		process.nextTick(function(){
			
			var database = req.app.get("database");
			
			database.UserModel.findOne({"email":email},function(err,user){
				
				if(err){
					return done(err);
				}
				
				//이미 사용자가 있는 경우
				if(user){
					
					return done(null,false,
							req.flash("signupMessage","계정이 이미 있습니다."));
					
				}else{
					
					//모델 인스턴스 객체를 만들어 저장
					var user = new database.UserModel({"email":email,"password":pwd,"name":name});
					
					user.save(function(err){
					
						if(err) throw err;
						
						
						return done(null,user);
						
					});					
				}
			});			
		});
	}	
);
