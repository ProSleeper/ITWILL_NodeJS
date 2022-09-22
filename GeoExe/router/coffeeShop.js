//1.스타벅스 정보를 저장하기 위한 함수를
const add = function (request, response) {
  const name = request.body.name;
  const addr = request.body.addr;
  const tel = request.body.tel;
  const longitude = request.body.longitude;
  const latitude = request.body.latitude;

  const database = request.app.get("database");

  if (database) {
    addCoffeeShop(database, name, addr, tel, longitude, latitude, function (err, result) {
      if (err) {
        responseHtml(response, "스타벅스 추가 중 에러 발생");
      }
      if (result) {
        responseHtml(response, "스타벅스 추가 성공");
      } else {
        responseHtml(response, "스타벅스 추가 실패");
      }
    });
  } else {
    responseHtml(response, "데이터 베이스 연결 실패");
  }
};

//스타벅스 정보를 조회하기 위한 라우팅 함수
const list = function (request, response) {
  console.log("coffeeShop - list 호출됨");
  const database = request.app.get("database");

  if (database) {
    //모든 스타벅스 검색
    database.CoffeeShopModel.findAll(function (err, result) {
      if (err) {
        responseHtml(response, "스타벅스 조회 중 에러 발생");
        return;
      }

      if (result) {
        responseHtmlul(response, "스타벅스 리스트");

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
        responseHtml(response, "스타벅스 리스트 조회 실패");
      }
    });
  } else {
    responseHtmlul(response, "데이터베이스 조회 실패");
    response.end();
  }
};

//스타벅스를 추가하는 함수
const addCoffeeShop = function (database, name, addr, tel, longitude, latitude, callback) {
  const coffeeShop = new database.CoffeeShopModel({
    name: name,
    addr: addr,
    tel: tel,
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });

  coffeeShop.save(function (err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log("스타벅스 데이터 추가함");
    callback(null, coffeeShop);
  });
};

//3. 가장 가까운 스타벅스 찾기위한 라우팅 함수
const findNear = function (request, response) {
  console.log("coffeeShop - findNear 호출됨");

  const maxDistance = 100; //10은 100m, 100은 1km

  const longitude = request.body.longitude;
  const latitude = request.body.latitude;

  const database = request.app.get("database");

  if (database) {
    database.CoffeeShopModel.findNear(longitude, latitude, maxDistance, function (err, result) {
      if (err) {
        responseHtml(response, "스타벅스 검색중 에러 발생");
        return;
      }

      if (result) {
        responseHtmlul(response, "가장 가까운 스타벅스");
        for (let i = 0; i < result.length; i++) {
          const name = result[i]._doc.name;
          const addr = result[i]._doc.addr;
          const tel = result[i]._doc.tel;
          const longitude = result[i]._doc.geometry.coordinates[0];
          const latitude = result[i]._doc.geometry.coordinates[1];
          response.write("<li>#" + (i + 1) + ":" + name + ", " + addr + ", " + tel + ", " + longitude + ", " + latitude + "</li>");
        }
        response.write("</ul></div>");
        response.end();
      } else {
        responseHtml(response, "가장 가까운 스타벅스 조회 실패");
      }
    });
  } else {
    responseHtml(response, "데이터베이스 연결 실패");
  }
};

//4. 범위안에 스타벅스 찾기위한 라우팅 함수
const findWithin = function (request, response) {
  console.log("coffeeShop - findNear 호출됨");

  const topLeftlongitude = request.body.topleft_longitude;
  const topLeftlatitude = request.body.topleft_latitude;
  const bottomRightlongitude = request.body.bottomright_longitude;
  const bottomRightlatitude = request.body.bottomright_latitude;

  const database = request.app.get("database");

  if (database) {
    database.CoffeeShopModel.findWithin(topLeftlongitude, topLeftlatitude, bottomRightlongitude, bottomRightlatitude, function (err, result) {
      if (err) {
        responseHtml(response, "스타벅스 검색중 에러 발생");
        return;
      }

      if (result) {
        responseHtmlul(response, "범위 내 가까운 스타벅스");
        for (let i = 0; i < result.length; i++) {
          const name = result[i]._doc.name;
          const addr = result[i]._doc.addr;
          const tel = result[i]._doc.tel;
          const longitude = result[i]._doc.geometry.coordinates[0];
          const latitude = result[i]._doc.geometry.coordinates[1];
          response.write("<li>#" + (i + 1) + ":" + name + ", " + addr + ", " + tel + ", " + longitude + ", " + latitude + "</li>");
        }
        response.write("</ul></div>");
        response.end();
      } else {
        responseHtml(response, "범위 내 스타벅스 조회 실패");
      }
    });
  } else {
    responseHtml(response, "데이터베이스 연결 실패");
  }
};

//5. 반경 안에 스타벅스 찾기위한 라우팅 함수
const findCircle = function (request, response) {
  console.log("coffeeShop - findCircle 호출됨");

  const centerlongitude = request.body.center_longitude;
  const centerlatitude = request.body.center_latitude;
  const radius = request.body.radius;

  const database = request.app.get("database");

  if (database) {
    try {
      
    
    database.CoffeeShopModel.findCircle(centerlongitude, centerlatitude, radius, function (err, result) {
      if (err) {
        responseHtml(response, "스타벅스 검색중 에러 발생");
        return;
      }

      if (result) {
        responseHtmlul(response, "범위 내 가까운 스타벅스");
        for (let i = 0; i < result.length; i++) {
          const name = result[i]._doc.name;
          const addr = result[i]._doc.addr;
          const tel = result[i]._doc.tel;
          const longitude = result[i]._doc.geometry.coordinates[0];
          const latitude = result[i]._doc.geometry.coordinates[1];
          response.write("<li>#" + (i + 1) + ":" + name + ", " + addr + ", " + tel + ", " + longitude + ", " + latitude + "</li>");
        }
        response.write("</ul></div>");
        response.end();
      } else {
        responseHtml(response, "범위 내 스타벅스 조회 실패");
      }
    });

  } catch (error) {
      
  }
  } else {
    responseHtml(response, "데이터베이스 연결 실패");
  }
};

//6. 가장 가까운 스타벅스를 지도에 찾기위한 라우팅 함수
const findNear2 = function (request, response) {
  console.log("coffeeShop - findNear2 호출됨");

  const maxDistance = 100; //10은 100m, 100은 1km

  const longitude = request.body.longitude;
  const latitude = request.body.latitude;

  const database = request.app.get("database");

  if (database) {
    database.CoffeeShopModel.findNear(longitude, latitude, maxDistance, function (err, result) {
      if (err) {
        responseHtml(response, "스타벅스 검색중 에러 발생");
        return;
      }

      if (result) {
        response.render('findNear.ejs', { result: result[0]._doc, longitude:longitude, latitude:latitude });

      } else {
        responseHtml(response, "가장 가까운 스타벅스 조회 실패");
      }
    });
  } else {
    responseHtml(response, "데이터베이스 연결 실패");
  }
};

const responseHtmlul = (response, msg) => {
  response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
  response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
  response.write("<h2>" + msg + "</h2>");
  response.write("<div><ul>");
};

const responseHtml = (response, msg) => {
  response.writeHead("200", { "Content-Type": "text/html;charset=UTF-8" });
  response.write("<meta name='viewport' content='width=device-width, " + "height=device-height, initial-scale=1'>");
  response.write("<h2>" + msg + "</h2>");
  response.end();
};

module.exports.add = add;
module.exports.list = list;
// module.exports.addCoffeeShop = addCoffeeShop;
module.exports.findNear = findNear;
module.exports.findWithin = findWithin;
module.exports.findCircle = findCircle;
module.exports.findNear2 = findNear2;

