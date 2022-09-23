console.log('handlerInfo 로딩됨');


//file: 핸들러 모듈 파일의 이름
//method: 등록한 핸들러의 이름(클라이언트가 호출하는 이름)

const handlerInfo =
  [
    {
      file:'./echo', method:'echo'
    },
    {
      file:'./echo_error', method:'echo_error'
    },
    {
      file:'./add', method:'add'
    },
    {
      file:'./echoEncrypt', method:'echo_encrypt'
    }
  ]
  
module.exports = handlerInfo;
