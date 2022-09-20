//인증방식의 객체를 설정
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "pwd",
    passReqToCallback: true, //아래 콜백함수의 첫번째 파라미터로 request객체에 전달됨
  },
  (request, email, pwd, done) => {
    const database = request.app.get("database");
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
  
});