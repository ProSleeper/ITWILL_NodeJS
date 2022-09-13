//파일 읽기(비동기화 방식)

const fs = require("fs");

fs.readFile('../data.json', 'utf-8', (err, data) => {

  console.log(data);

});

console.log('비동기화 방식으로 파일 읽음..');