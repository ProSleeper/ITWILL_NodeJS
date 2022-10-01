const index = (request, response) => {
  console.log("/process/index 호출됨");
  response.render("index.ejs");
};

const test = (request, response) => {
  console.log("/process/test 호출됨");
  console.log(request.cookies);

  response.cookie("cookieKey", "five");
  response.status(200).send("ok");
};

const basic = (request, response) => {
  console.log("/process/test 호출됨");
  console.log(request.cookies);

  response.cookie("cookieKey", "개잘줌");
  response.status(200).send("ok");
};

module.exports.index = index;
module.exports.test = test;
module.exports.basic = basic;
