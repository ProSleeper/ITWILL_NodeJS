// //데이터베이스 객체, 스키마 객체, 모델 객체
// let database;
// let UserSchema;
// let UserModel;

// const init = (db, schema, model) => {
//   console.log('init 호출됨');

//   database = db;
//   UserSchema = schema;
//   UserModel = model;
// }

const moment = require('moment');

const login = (request, response) => {
  console.log("/process/login 호출됨");
  const id = request.body.id || request.query.id;
  const pwd = request.body.pwd || request.query.pwd;

  const database = request.app.get("database");
  if (database) {
    authUser(database, id, pwd, (err, result) => {
      if (err) throw err;
      if (result) {
        const userName = result[0].name;
        const context = { userId: id, userName: userName };

        // request.app.render("login.ejs", context, (err, html) => {
        request.app.render("login_Success", context, (err, html) => {

          if (err) {
            response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
            response.write("<h2>뷰 렌더링 중 에러발생</h2>");
            response.end();
            return;
          }
          console.log("rendered: " + html);
          response.end(html);
        });

        // response.end("<br/><br/><a href='/public/login.html'>로그인</a>");
      } else {
        response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
        response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
        response.write("<h1>로그인 성공</h1>");
        response.write("<div>아이디와 패스워드가 틀립니다.</div>");
        response.end("<br/><br/><a href='/public1/login.html'>로그인</a>");
      }
    });
  } else {
    response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
    response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
    response.write("<h1>데이터베이스 연결 실패</h1>");
    response.write("<div>데이터베이스에 연결하지 못했습니다.</div>");
    response.end();
  }
};

const addUsers = (request, response) => {
  console.log("/process/addUser 호출됨");

  const id = request.body.id;
  const pwd = request.body.pwd;
  const name = request.body.name;

  const database = request.app.get("database");

  if (database) {
    addUser(database, id, pwd, name, (err, result) => {
      if (err) throw err;

      if (result) {
        const context = { title: '사용자 추가 성공(View - jade)' };
        // request.app.render('addUser', context, (err, html) => {
        request.app.render('addUser_Success', context, (err, html) => {
        
          if (err) {
            response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
            response.write("<h2>뷰 렌더링 중 에러발생</h2>");
            response.end();
            return;
          }
          //console.log("rendered: " + html);
          response.end(html);
        })
      } else {
        response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
        response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
        response.write("<h1>사용자 추가 실패</h1>");
        response.write("<br/><br/><a href='/public1/login.html'>로그인</a>");
        response.end();
      }
    });
  } else {
    response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
    response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
    response.write("<h1>데이터베이스 연결 실패</h1>");
    response.write("<div>데이터베이스에 연결하지 못했습니다.</div>");
    response.end();
  }
};

const listUser = (request, response) => {
  console.log("/process/listUser 호출됨");

  //request.app.get 이거는 도대체 어떻게 온거지?
  //app.get은 database에서 넣어줘서 가능한건 알겠는데, request.app을 할 수 있는 이유가 뭐지?
  const database = request.app.get("database");

  if (database) {
    database.UserModel.findAll((err, result) => {
      if (err) {
        response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
        response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
        response.write("<h2>사용자 리스트 조회 중 에러 뿜뿜</h2>");
        response.end();
        return;
      }

      if (result) {
        const context = { result: result, moment:moment };
        // request.app.render("listUserResp", context, (err, html) => {
        request.app.render("listUserResp_Success", context, (err, html) => {
        
          if (err) {
            response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
            response.write("<h2>뷰 렌더링 중 에러발생</h2>");
            response.end();
            return;
          }
          response.end(html);
        });
      } else {
        response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
        response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
        response.write("<h2>사용자 리스트 조회 실패 ㅠㅠ</h2>");
        response.write("");
      }
    });
  } else {
    response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
    response.write('<meta name="viewport" content="width = device - width, height = device - height, initial - scale=1.0">');
    response.write("<h1>데이터베이스 연결 실패</h1>");
    response.write("<div>데이터베이스에 연결하지 못했습니다.</div>");
    response.end();
  }
};

/************************************************************************************************************/

//사용자 인증 함수
const authUser = (database, id, pwd, callback) => {
  console.log("유저로그인");
  //id, pwd 로 검색
  database.UserModel.findById(id, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (result.length > 0) {
      //아이디가 존재하면 result값이 있으므로 pwd 비교를 할 수 있다.
      console.log("아이디 일치");
      const user = new database.UserModel({ id: id });
      // const user = new UserModel({ id:id });
      const authenticated = user.authenticate(pwd, result[0]._doc.salt, result[0]._doc.hashed_password);

      if (authenticated) {
        console.log("패스워드 일치");
        callback(null, result);
      } else {
        console.log("패스워드 불일치");
        callback(null, null);
      }
    } else {
      console.log("일치하는 사용자가 없습니다.");
      callback(null, null);
    }
  });
};

//사용자 추가 함수
const addUser = (database, id, pwd, name, callback) => {
  console.log("회원가입");
  const user = database.UserModel({ id: id, password: pwd, name: name });
  //추가
  user.save((err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (result) {
      console.log("사용자 추가됨");
    } else {
      console.log("사용자 추가 실패");
    }

    callback(null, result);
  });
};

module.exports.login = login;
module.exports.addUser = addUsers;
module.exports.listUser = listUser;
// module.exports.init = init;
