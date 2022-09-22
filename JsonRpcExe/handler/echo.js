const echo = function (params, callback) {
  try {
  console.log('JSON-RPC echo 호출됨');
  console.log(params);

  callback(null, params);

  
  } catch (error) {
    console.error(error);
  }
};

module.exports = echo;