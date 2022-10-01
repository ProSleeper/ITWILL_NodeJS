//router.route("/process/login").post(user.login);

const config = require("../config/config");

let routerLoader = {};

routerLoader.init = (app, router) => {
  console.log("routerLoader 호출됨");

  return initRouters(app, router);
};

const initRouters = (app, router) => {
  //const infoLen = config.routeInfo.length;
  config.routeInfo.forEach((element, index) => {
    const curItem = element;
    const curModule = require(curItem.file);
    //console.log(curItem.method);
    //console.log(curModule[curItem.method]);
    if (curItem.type == "get") {
      router.route(curItem.path).get(curModule[curItem.method]);
    } else if (curItem.type == "post") {
      router.route(curItem.path).post(curModule[curItem.method] /* <-- 콜백함수임. */);
    } else {
      router.route(curItem.path).post(curModule[curItem.method]);
    }
  });

  app.use("/", router);
};

module.exports = routerLoader;
