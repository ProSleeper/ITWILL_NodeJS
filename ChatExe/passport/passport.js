const localLogin = require("./localLogin")
const localSignup = require("./localSignup");

module.exports = (app, passport) => {
  console.log("passport.js 호출");

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

  passport.use("local-login", localLogin);
  passport.use("local-signup", localSignup);
};
