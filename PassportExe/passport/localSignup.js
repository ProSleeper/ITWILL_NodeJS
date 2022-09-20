//인증방식의 객체를 설정
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
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
      const database = request.app.get("database");
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
);