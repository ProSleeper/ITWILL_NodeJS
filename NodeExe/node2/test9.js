const fs = require('fs')



//디렉토리 만들기
fs.mkdir('./doc', (err) => {
  if (err) throw err

  console.log('doc폴더 생성');
})

//디렉토리 삭제
fs.rmdir('./doc', (err) => {
  if (err) throw err

  console.log('doc 폴더 삭제')
})

console.log('비동기라도 순서는 존재한다.');