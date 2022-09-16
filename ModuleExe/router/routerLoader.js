//router.route("/process/login").post(user.login);

const config = require('../config');

let routerLoader = {};

routerLoader.init = (app, router) => {
  console.log('routerLoader 호출됨');
  
  return initRouters(app, router);
}

const initRouters = (app, router) => {
  //const infoLen = config.routeInfo.length;

  config.routeInfo.forEach((element, index) => {
    
    const curItem = element;
    const curModule = require(curItem.file); 
    console.log(curItem);
    //console.log(curItem.method);
    //console.log(curModule[curItem.method]);
    if (curItem.type == 'get') {
      console.log('로그1');
      router.route(curItem.path).get(curModule[curItem.method]);
    }
    else if (curItem.type == 'post') {
      console.log('로그인2');
      router.route(curItem.path).post(curModule[curItem.method]);
    }
    else {
      console.log('로그인3');
      router.route(curItem.path).post(curModule[curItem.method]);
    }
  })

  app.use('/', router);
}

module.exports = routerLoader;
