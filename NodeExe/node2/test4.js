//파일 읽기(동기화 방식)

const fs = require("fs");

let data = fs.readFileSync('../data.json', 'utf-8');

console.log(data);

console.log('동기화 방식으로 파일 읽음..');