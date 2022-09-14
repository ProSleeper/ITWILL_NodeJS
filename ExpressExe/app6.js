require("dotenv").config(); //외부에서 알면 안되는 정보들

const express = require("express");
const http = require("http");
const serveStatic = require("serve-static");
const path = require("path");
const exp = require("constants");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const multer = require("multer");

//익스프레스 객체 생성
const app = express();

//env(환경변수) 외부에 노출되지 않아야 하는 정보를 모아놓는 곳
app.set("port", process.env.PORT || 2000); //process.env.PORT에 PORT정보가 없으면 2000번으로 설정한다.
//OR연산이므로 ||을 기준으로 왼쪽이 true면 오른쪽은 실행을 하지 않으므로 PORT에 정보가 있으면 설정된 PORT번호로 지정되고
//왼쪽이 false면 오른쪽을 실행해서 2000을 포트번호로 사용한다.

//미들웨어
//application/x-www-form-urlencoded : false
app.use(express.urlencoded({ extended: false })); //false로 하면 html파일에서 form 에서의 enctype="application/x-www-form-urlencoded"과 같은 의미 이다.

//json 데이터 파싱
app.use(express.json());
//path.join(__dirname, 'public') << 크롤링 코드에 적용하자 path부분
app.use("/public", serveStatic(path.join(__dirname, "public"))); //상대경로 설정
app.use("/upload", serveStatic(path.join(__dirname, "uploads"))); //상대경로 설정


const encoding = (string) => {
  return Buffer.from(string, "latin1").toString("utf8");
};

//storage의 저장 방법 설정
const storageMethod = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    const extension = path.extname(encoding(file.originalname)); //확장자
    const basename =path.basename(encoding(file.originalname), extension); //파일 이름

    callback(null, basename + extension); //abc.txt
    // callback(null, file.originalname); //abc.txt
    // callback(null, basename + Date.now() + extension); //abc5754684213213.txt
  },
});

const upload = multer({
  storage: storageMethod,
  limits: {
    file: 10,
    fileSize: 1024 * 1024 * 1024,
  },
});

//앞의 /public은 가상의 주소 뒤의 /public 은 실제 주소

//쿠키 미들웨어
app.use(cookieParser());

//세션 설정
app.use(
  expressSession({
    secret: "my key", //쿠키를 임의로 변조하는 것을 방지
    resave: true, //세션을 항상 저장할지 선택
    saveUninitialized: true, //세션을 만들고 만든 세션이 변경되지 않게끔 하는 옵션
  })
);

//라우터 객체 추가
const router = express.Router();
//app.use((request, response, next) => {

// router와 app의 차이점은 뭔가??????????

router.route("/process/file").post(upload.array("upload", 2), (request, response) => {
  // router.post("/process/file", (request, response) => {
  console.log("/process/file 호출됨");

  try {
    const files = request.files; //파일 정보는 배열로 받는다.
    //console.log(request.files[0]);

    let originalName = null;
    let fileName = null;
    let mimeType = null;
    let size = null;

    response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
    response.write("<h1>파일 업로드 성공</h1>");

    if (Array.isArray(files)) {
      console.log("배열안에 파일 갯수: " + files.length);

      files.forEach((data, index) => {
        // originalName = data.originalname;
        originalName = encoding(data.originalname);
        // fileName = data.filename;
        fileName = data.filename;
        mimeType = data.mimetype;
        size = data.size;
        response.write("<div>원본 파일명: " + originalName + "</div>");
        response.write("<div>저장 파일명: " + fileName + "</div>");
        response.write("<div>파일 유형: " + mimeType + "</div>");
        response.write("<div>파일 크기: " + size + "</div>");
        response.write("<hr/>");
      });
    }

    // if (Array.isArray(files)) {
    //   console.log('배열안에 파일 갯수: ' + files.length);
    //   for (let i = 0; i < array.length; i++) {
    //       originalName = files[i].originalname;
    //       fileName = files[i].filename;
    //       mimeType = files[i].mimetype;
    //       size = files[i].size;
    //   }
    // }

    response.end();
  } catch (error) {
    console.error(error.stack);
  }
});

app.use("/", router);

const errorHandler = expressErrorHandler({
  static: {
    404: "./public/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// app.use("/", (request, response, next) => {
//   console.log('두번째 미들웨어에서 요청을 처리함');
//   response.writeHead('200', { 'Content-Type': 'text/html;charset=utf-8' });
//   response.end('<h1>' + request.user + '가 응답한 응답한 결과 입니다.</h1>');
// })

//Express 서버 시작
http.createServer(app).listen(app.get("port"), () => {
  console.log("익스프레스 서버를 시작했습니다: " + app.get("port"));
});
