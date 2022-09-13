//파일 쓰기

const fs = require('fs');

fs.writeFile('./output.txt', 'Hello World!!', (err) => {
  if (err) {
    console.error(err);
  }

  console.log('ouput.txt 파일에 쓰기 완료');

});

