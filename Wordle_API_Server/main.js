/**
 * 만들다가 도저히 cookie를 전달해주지 않아서 포기..
 * 도대체 왜 cookie를 안주는걸까....
 */

require("dotenv").config(); //외부에서 알면 안되는 정보들

const express = require("express");
const http = require("http");
const serveStatic = require("serve-static"); //특정 폴더 패스로 접근
const path = require("path");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
const routerLoader = require("./router/routerLoader");

const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || config.serverPort);

app.use(express.urlencoded({ extended: false }));

//json 데이터 파싱
app.use(express.json());
app.use("/public", serveStatic(path.join(__dirname, "public")));
app.use(cors());

//쿠키 미들웨어
app.use(cookieParser());

//라우터 객체
const router = express.Router();

//라우터 매핑
routerLoader.init(app, router);

const errorHandler = expressErrorHandler({
  static: {
    404: "./public/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.log("서버 프로세스 종료하지 않고 유지함");
});

//Express 서버 시작
const host = "localhost";
http.createServer(app).listen(app.get("port"), host, () => {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
});
