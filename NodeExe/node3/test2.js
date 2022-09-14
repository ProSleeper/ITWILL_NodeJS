let http = require("http");

//웹서버 객체 생성
let server = http.createServer((request, response) => {
  console.log('클라이언트의 요청이 들어왔습니다.');
  
  response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
  response.write('<!DOCTYPE html>')
  response.write('<html lang="en">')
  response.write('<head>')
  response.write('<title>응답 페이지</title>')
  response.write('</head>')
  response.write('<body>')
  response.write('<h1>서버에서 받은 응답</h1>')
  response.write('</body>')
  response.write('</html>')
});
let port = 3000;
let host = '192.168.16.6';
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
 
});

//서버 종료 이벤트 처리
server.on('close', () => {
  console.log('서버가 종료 됩니다.');
})












