

const echo_error = function (params, callback) {
  
  console.log('JSON-RPC echo_error 호출됨');
  console.log(params);

  if (params.length < 2) {
    console.log('요기요');
    callback({ code: 400, message: '파라미터가 부족합니다.' }, null);
    console.log('조기요');
    return;
  }

  const output = '성공';
  callback(null, output);

};

module.exports = echo_error;