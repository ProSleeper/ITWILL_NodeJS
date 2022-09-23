
const add = function (params, callback) {

  if (params.length < 2) {
    callback({ code: 400, message: '파라미터 갯수가 부족합니다.' }, null);
    return;
  }

  const num1 = params[0];
  const num2 = params[1];
  
  const output = num1 + num2;

  callback(null, output);

};


module.exports = add;