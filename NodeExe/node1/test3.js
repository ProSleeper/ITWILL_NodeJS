//os

let os = require('os')

console.log(os.hostname);
console.log(os.freemem + "/" + os.totalmem);//사용메모리/전체메모리
console.log(os.cpus()); //cpu에 대한 정보
console.log(os.networkInterfaces());//네트워크에 대한 정보


//path
let path = require('path')

let dir = ['users', 'itwill', 'docs'];

let docDir = dir.join(path.sep);
console.log(docDir);

let curPath = path.join('user/itwill', 'notepad.exe');
console.log(curPath);

let filePath = "c:\\users\\itwill\\notepad.exe";
let dirName = path.dirname(filePath);   // 디렉토리 패스
let fileName = path.basename(filePath); //파일명
let extName = path.extname(filePath);   //확장자명

console.log(dirName);
console.log(fileName);
console.log(extName);

















