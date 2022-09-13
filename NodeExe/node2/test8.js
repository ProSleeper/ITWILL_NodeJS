const fs = require('fs');

const inName = "./output.txt";
const outName = "./output3.txt";

fs.exists(outName, (fileName) => {  //outName이 존재하면 fileName에는 true, 없으면 false 들어가서 if문에서 판별하게 된다.
  if (fileName) {
    fs.unlink(outName, (err) => { //unlink: 파일 삭제
      
      if (err) throw err;
      
      console.log(outName + '파일 삭제함..');
    });
    return;
  }
  const inFile = fs.createReadStream(inName, { flags: 'r' });
  const outFile = fs.createWriteStream(outName, { flags: 'w' });

  inFile.pipe(outFile);

  console.log('파일 복사 성공');


})














