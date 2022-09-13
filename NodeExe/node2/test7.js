
//파일 복사
const fs = require("fs");

const inFile = fs.createReadStream('./output.txt', { flags: 'r' });
const outFile = fs.createWriteStream('./output2.txt', { flags: 'a+' });



inFile.on('data', (str) => {
  console.log('파일 읽음');
  outFile.write(str);
});

inFile.on('end', () => {
  console.log('파일 읽기 종료');

  //얘는 누가 불러주는걸까?
  //outFile.write(str); 이 코드가 끝나면 자동으로 end를 해서 그런건가?
  outFile.end(() => {
    console.log('쓰기 완료');
  })
});


