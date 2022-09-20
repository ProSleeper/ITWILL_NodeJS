module.exports = (router, passport) => {

  console.log('passport 모듈 호출');
  
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
}