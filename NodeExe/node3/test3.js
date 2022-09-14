const http = require("http");
const fs = require("fs");

//웹서버 객체 생성
const  server = http.createServer();
const port = 3000;
const host = '192.168.16.6';
// let host = '192.168.16.6';

server.listen(port, host, 5000, () => {
  console.log('웹서버가 실행됐습니다. : %d', port);
});

//클라이언트 연결 이벤트 처리
server.on('connection', (socket) => {
  console.log('클라이언트가 접속했습니다:' + socket.remoteAddress + ":" + socket.remotePort);
})

//클라이언트 요청 이벤트
server.on('request', (request, response) => {
  console.log('클라이언트의 요청이 들어왔습니다.');
  
  const fileName = "./image/angelina.png";
  fs.readFile(fileName, (err, data) => {
    response.writeHead(200, { 'Content-Type': 'image/png;charset=utf-8' })
    response.write(data);
    response.end();
  })
});

//서버 종료 이벤트 처리
server.on('close', () => {
  console.log('서버가 종료 됩니다.');
})












