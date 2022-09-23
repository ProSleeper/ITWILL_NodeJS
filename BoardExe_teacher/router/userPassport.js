
	/*
	클라이언트 요청	웹서버		뷰템플릿

	홈화면조회		/				홈화면(index.ejs)
	로그인화면조회	/login(get)		로그인화면(login.ejs)
	로그인요청		/login(post)	로그인처리(함수)- xxx_ok.jsp
	회원가입조회	/signup(get)	회원가입화면(signup.ejs)
	회원가입요청	/signup(post)	회원가입처리(함수)
	사용자프로필	/profile(get)	프로필화면(profile.ejs)
	로그아웃요청	/logout(get)	로그아웃처리(함수)
	*/

module.exports = function(router,passport){
	
	console.log("userPassport 호출");	


	//홈화면 조회 - index.ejs
	router.route("/").get(function(req,res){
		
		res.render("index.ejs");
		
	});

	//로그인화면조회	/login(get)		로그인화면(login.ejs)
	router.route("/login").get(function(req,res){
			
		res.render("login.ejs",{message:req.flash("loginMessage")});
		
	});

	//로그인요청		/login(post)	로그인처리(함수)
	router.route("/login").post(passport.authenticate("local-login",{

		successRedirect: "/profile", //성공
		failureRedirect: "/login",	//실패	
		failureFlash: true //실패시 flash메세지가 응답 페이지에 전달 되도록 함
		
	}));


	//회원가입조회	/signup(get)	회원가입화면(signup.ejs)
	router.route("/signup").get(function(req,res){
		
		res.render("signup.ejs",{message:req.flash("signupMessage")});
		
	});

	//회원가입요청	/signup(post)	회원가입처리(함수)
	router.route("/signup").post(passport.authenticate("local-signup",{

		successRedirect: "/profile", //성공
		failureRedirect: "/signup",	//실패	
		failureFlash: true //실패시 flash메세지가 응답 페이지에 전달 되도록 함
		
	}));


	//사용자프로필	/profile(get)	프로필화면(profile.ejs)
	router.route("/profile").get(function(req,res){
		
		//인증이 안된경우
		if(!req.user){
			
			res.redirect("/");
			return;
			
		}
		
		//인증이 된 경우
		if(Array.isArray(req.user)){
			
			res.render("profile.ejs",{user:req.user[0]._doc});
			
		}else{
			
			res.render("profile.ejs",{user:req.user});
		}
		
	});

	//로그아웃요청	/logout(get)	로그아웃처리(함수)
	router.route("/logout").get(function(req,res){
		
		req.logout();
		res.redirect("/");
		
	});
	
}



