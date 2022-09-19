const testJade = (request, response) => {
  console.log("jadeTest.js 호출됨");
  

  const context = {};

  request.app.render("jadeTest", context, (err, html) => {
    if (err) {
      throw err;
    }

    console.log("rendered: " + html);
    response.writeHead("200", { "Content-Type": "text/html;charset=utf-8" });
    response.end(html);
  });
};

module.exports.testJade = testJade;
