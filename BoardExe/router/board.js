//const Entities = require('html-entities').AllHtmlEntities

const moment = require('moment');

//게시글 추가
const addBoard = function (request, response) {
  console.log("addBoard 호출됨");

  const title = request.body.title;
  const content = request.body.contents;
  const writer = request.body.writer;

  try {
    const database = request.app.get("database");

    if (database) {
      //이메일을 이용해 사용자 검색
      database.UserModel.findByEmail(writer, function (err, result) {
        if (err) {
          responseHtml(response, "게시글 추가 중 에러 발생");

          return;
        }

        if (result == undefined || result.length < 1) {
          responseHtml(response, `사용자 [${writer}]를 찾을 수 없습니다.`);
          return;
        }

        const userObjectId = result[0]._doc.id;
        const board = new database.BoardModel({
          title: title,
          content: content,
          writer: userObjectId,
        });
        board.saveBoard(function (err, result) {
          if (err) {
            responseHtml(response, "게시글 추가 중 에러 발생");
            return;
          }
          console.log("게시글 데이터 추가: " + board._id);

          return response.redirect("/process/showboard" + board._id);
        });
      });
    } else {
      responseHtml(response, "데이터베이스 연결 실패");
    }
  } catch (error) {
    console.error(error);
  }
};

const showBoard = function (request, response) {
  console.log("showBoard 호출됨");

  const id = request.params.id;

  const database = request.app.get("database");

  if (database) {
    //글 리스트
    database.BoardModel.load(id, function (err, result) {
      if (err) {
        responseHtml(response, "게시글 조회 중 에러 발생");
        return;
      }
    });
    if (result) {
      //조회 수 없데이트
      database.BoardModel.updateHitCount(result._doc.id, function (err2, result2) {
        if (err2) {
          console.log("updateHitCount 실행 중 에러 발생");
        }
      });

      // response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
      // response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
      const content = {
        title: "게시글 보기",
        result: result,
        // Entities:Entities
      };
      request.app.render("showBoard.ejs", content, function (err, html) {
        if (err) {
          responseHtml(response, "게시글 조회 중 에러 발생");
          return;
        }
        response.end(html);
      });
    } else {
      responseHtml(response, "게시글 조회 실패");
    }
  } else {
    responseHtml(response, "데이터 베이스 연결 실패");
  }
};

const listBoard = function (request, response) {
  console.log("listBoard 호출.");

  const page = request.param("page");
  const perPage = request.param("perPage");

  const database = request.app.get("database");

  // 데이터베이스 객체가 초기화된 경우
  if (database) {
    // 1. 글 리스트
    const option = {
      page: page,
      perPage: perPage,
    };

    database.BoardModel.list(option, function (err, result) {
      if (err) {
        responseHtml(response, "게시판 글 목록 조회 중 에러 발생");

        return;
      }

      if (result) {
        // 전체 문서 객체 수 확인
        database.BoardModel.count().exec(function (err, count) {
          response.writeHead("200", { "Content-Type": "text/html;charset=utf8" });

          // 뷰 템플레이트를 이용하여 렌더링한 후 전송
          const context = {
            title: "게시판 리스트",
            result: result,
            page: parseInt(page),
            pageCount: Math.ceil(count / perPage), //페이지갯수
            perPage: perPage, //한페이지당 데이터 표시 갯수
            totalRecords: count,
            size: perPage,
            moment: moment,
          };

          request.app.render("listBoard.ejs", context, function (err, html) {
            if (err) {
              responseHtml(response, "응답 웹문서 생성 중 에러 발생");

              return;
            }

            response.end(html);
          });
        });
      } else {
        responseHtml(response, "글 목록 조회  실패");
      }
    });
  } else {
    responseHtml(response, "데이터베이스 연결 실패");
  }
};

const responseHtmlul = (response, msg) => {
  response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
  response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
  response.write("<h2>" + msg + "</h2>");
  response.write("<div><ul>");
};

const responseHtml = (response, msg) => {
  response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
  response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
  response.write("<h2>" + msg + "</h2>");
  response.end();
};

module.exports.addBoard = addBoard;
module.exports.showBoard = showBoard;
module.exports.listBoard = listBoard;
