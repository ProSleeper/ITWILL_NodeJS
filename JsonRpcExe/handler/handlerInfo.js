console.log('handlerInfo 로딩됨');


//file: 핸들러 모듈 파일의 이름
//method: 등록한 핸들러의 이름(클라이언트가 호출하는 이름)

const handlerInfo =
  [
    {
      file:'./echo', method:'echo'
    }
  ]
  
module.exports = handlerInfo;
