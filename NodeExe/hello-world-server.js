let http = require("http");

http.createServer(function handleer(req, res){
  res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
  res.end('IOS 16 업데이트 중!!\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
