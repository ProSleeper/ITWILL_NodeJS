/*
**********************************************************
* 외부 모듈 설치하기(npm)
**********************************************************
package.json 파일생성
npm init 실행 (기본 외부모듈 설치-기본값 엔터)

npm install 모듈이름 : 설치
npm uninstall 모듈이름 : 삭제
npm install -g npm : 모든 모듈 업데이트

npm install 모듈이름 --save : package.json 파일에 저장
npm install 모듈이름 --g(--global) : 전역 환경에 파일 저장
C:\Users\itwill\AppData\Roaming\npm\node_modules

npm install : package.json 파일에 기록된 모든패키지 설치

npm list : 설치된 패키지 정보
npm list -g : 전역환경에 설치된 정보
  **********************************************************
*/

// //로그 처리 모듈
// const { transport } = require('winston');
// const winston = require('winston')

// //일별 로그 처리 모듈
// const winstonDaily = require('winston-daily-rotate-file')

// const logger = winston.createLogger({
  
//   //로그 수준(debug:0->info:1->notice:2->warning:3->error:4->crit:5->alert:6->emerg:7)
  
//   level: 'info',
//   format: winston.format.simple(),
//   transport: [
//     new (winston.transports.Console)({
//         colorize:true
//     }),
//     new(winstonDaily)({
//     filename: './log/server_%DATE%.log',
//       maxsize: '10m',
//     datePattern:'YYYY-MM-DD HH-mm-ss'
//   })
//   ]
// })

const logger = require('./logger')

const fs = require('fs');

const inName = "./output.txt";
const outName = "./output3.txt";

fs.exists(outName, (fileName) => {  //outName이 존재하면 fileName에는 true, 없으면 false 들어가서 if문에서 판별하게 된다.
  if (fileName) {
    fs.unlink(outName, (err) => { //unlink: 파일 삭제
      
      if (err) throw err;
      
      logger.info(outName + '파일 삭제함..');
    });
    return;
  }
  const inFile = fs.createReadStream(inName, { flags: 'r' });
  const outFile = fs.createWriteStream(outName, { flags: 'w' });

  inFile.pipe(outFile);

  logger.info('파일 복사 성공');


})








