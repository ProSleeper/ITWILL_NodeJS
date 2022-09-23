
const crypto = require('crypto-js');
const echo_encrypt = function (params, callback) {

  try {
  console.log('JSON-RPC echoEncrypt 호출됨');
  //console.dir(params);

  //클라이언트에서 넘어온 암호화 된 데이터를 복호화
    let encrypted = params[0];
    //console.log(encrypted);
    console.log('클라이언트가 보낸 암호 데이터: ' + encrypted);
    const secret = 'my secret';
    let decrypted = crypto.AES.decrypt(encrypted, secret).toString(crypto.enc.Utf8);
    //console.log(typeof decrypted);
    console.log('클라이언트가 보낸 복호화된 데이터: ' + decrypted);

    //클라이언트에게 보내기 위해 암호화
    encrypted = '' + crypto.AES.encrypt(decrypted, secret);
    console.log('서버에서 암호화 시킨 데이터: ' + encrypted);

    params[0] = encrypted;

  } catch (error) {
    console.error(error);
  }

  callback(null, params);
};

module.exports = echo_encrypt;