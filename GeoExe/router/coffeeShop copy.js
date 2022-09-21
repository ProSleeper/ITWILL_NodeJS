//1.스타벅스 정보를 저장하기 위한 함수를
const add = (request, response) => {
  const name = request.body.name;
  const addr = request.body.addr;
  const tel = request.body.tel;
  const longitude = request.body.longitude;
  const latitude = request.body.latitude;

  const database = request.app.get("database");

  if (database) {
    addCoffeeShop(database, name, addr, tel, longitude, latitude, (err, result) => {
      if (err) {
        response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
        response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
        response.write("<h2>스타벅스 추가 중 에러 발생</h2>");
        response.end();

        responseHtml(response, "스타벅스 추가 중 에러 발생");
      }

      if (result) {
        response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
        response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
        response.write("<h2>스타벅스 추가 성공</h2>");
        response.end();
      } else {
        response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
        response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
        response.write("<h2>스타벅스 추가 실패</h2>");
        response.end();
      }
    });
  } else {
    response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
    response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
    response.write("<h2>데이터 베이스 연결 실패</h2>");
    response.end();
  }
};

//스타벅스 정보를 조회하기 위한 라우팅 함수
const list = (request, response) => {
  console.log("coffeeShop - list 호출됨");
  const database = request.app.get("database");

  if (database) {
    //모든 스타벅스 검색
    database.CoffeeShopModel.findAll((err, result) => {
        if (err) {
          response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
          response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
          response.write("<h2>스타벅스 조회 중 에러 발생</h2>");
          response.end();
          return;
        }

        if (result) {
          response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
          response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
          response.write("<h2>스타벅스 리스트</h2>");
          response.write("<div><ul>");

          for (let i = 0; i < result.length; i++) {
            const curName = result[i]._doc.name;
            const curAddr = result[i]._doc.addr;
            const curTel = result[i]._doc.tel;
            const curLongitude = result[i]._doc.geometry.coordinates[0];
            const curLatitude = result[i]._doc.geometry.coordinates[1];

            response.write("<li>#" + (i + 1) + " : " + curName + ", " + curAddr + ", " + curTel + ", " + curLongitude + ", " + curLatitude + "</li>");
          }

          response.write("</ul></div>");
          response.end();

          // result.forEach((element, index) => {
          //   const curName = result[i]._doc.name;
          //   const curAddr = result[i]._doc.addr;
          //   const curTel = result[i]._doc.tel;
          //   const curLongitude = result[i]._doc.geometry.coordinates[0];
          //   const curLatitude = result[i]._doc.geometry.coordinates[1];
          // });
        } else {
          response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
          response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
          response.write("<h2>스타벅스 리스트 조회 실패</h2>");
          response.end();
        }
    });
  } else {
    response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
    response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
    response.write("<h2>데이터베이스 조회 실패/h2>");
    response.write("<div><ul>");
    response.end();
  }
};

//스타벅스를 추가하는 함수
const addCoffeeShop = (database, name, addr, tel, longitude, latitude, callback) => {
  const coffeeShop = new database.CoffeeShopModel({
    name: name,
    addr: addr,
    tel: tel,
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });

  coffeeShop.save((err) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log("스타벅스 데이터 추가함");
    callback(null, coffeeShop);
  });
};

const responseHtml = (response, msg) => {
  response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
  response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
  response.write("<h2>" + msg + "</h2>");
  response.end();
}


module.exports.add = add;
module.exports.list = list;
module.exports.addCoffeeShop = addCoffeeShop;
