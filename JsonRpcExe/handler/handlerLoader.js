const handlerLoader = {};

const handlerInfo = require("./handlerInfo");
const utils = require("jayson/lib/utils");

handlerLoader.init = function (jayson, app, apiPath) {
  console.log("handlerLoader.init 호출됨");
  return initHandlers(jayson, app, apiPath);
};

//handler_info 에 정의된 핸들러 정보 처리
function initHandlers(jayson, app, apiPath) {
  // console.log("제이슨");
  // console.log(apiPath);
  // console.log("끝");
    const handlers = {};
    //console.log('핸들러 개수' + infoLen);

    for (let index = 0; index < handlerInfo.length; index++) {
      const curItem = handlerInfo[index];

      //모듈파일에서 모듈 읽음
      const curHandler = require(curItem.file);

      //핸들러 함수 등록
      handlers[curItem.method] = new jayson.Method({
        handler: curHandler,
        collect: true,
        params: Array,
      });
      //console.log("메소드 " + curItem.method + "가 핸들러로 추가됨");
    }

    //Jayson 서버 객체 생성
    const jaysonServer = jayson.server(handlers);
    //console.log(jaysonServer);
    //app의 패스로 라우팅
    app.post(apiPath, function (request, response, next) {
      //console.log('패스 [' + apiPath + ']에서 JSON-RPC 호출됨');
      const options = {};

      //Content-Type이 application/json이 아니면 에러
      const contentType = request.headers["content-type"] || "";
      
      if (!RegExp("application/json", "i").test(contentType)) {
        //console.log('application/json 타입이 아님');
        return error(415);
      }

      ;

      //body 부분에 데이터가 없는 경우 에러
      if (!request.body || typeof request.body != "object") {
        //console.log('요청 body가 비정상임');
        return error(400, "Body Error");
      }

      

      // console.log("제이슨");
      // console.log(request.body);
      // console.log("끝");

      //RPC 함수 호출
      //console.log('RPC 함수를 호출합니다.');

      jaysonServer.call(request.body, function (err, success) {
        const res = err || success;
        
        //console.log(err);
        console.log(success);

        //console.log(response.body);
        console.log("앱앱");
        console.log(res)




        //결과 데이터를 JSON으로 만들어 응답
        utils.JSON.stringify(res, options, function (err, body) {
          
          if (err) return err;
        
          if (body) {
            const headers = {
              "Content-Length": Buffer.byteLength(body, "utf-8"),
              "Content-Type": "application/json;",
            };

            response.writeHead(200, headers);
            response.write(body);
          } else {
            response.writeHead(204);
          }
          response.end();
        });
      });

      //에러 응답
      function error(code, headers) {
        response.writeHead(code, headers || {});
        response.end();
      }
      
    });
    return handlers;
}

module.exports = handlerLoader;
