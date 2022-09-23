

var routerLoader = {};

var config = require("../config/config");

routerLoader.init = function(app, router){
	
	console.log("routerLoader 호출");
	
	return initRouters(app,router);
	
};

//routerInfo에 있는 라우팅 정보 처리
function initRouters(app,router){
	
	var infoLen = config.routerInfo.length;//3
	
	for(var i=0;i<infoLen;i++){
		
		var curItem = config.routerInfo[i];
		
		//모듈 호출
		var curModule = require(curItem.file);//user.js
		
		//라우팅 처리
		if(curItem.type=="get"){			
			//router.route("/process/login").get(user.login);
			router.route(curItem.path).get(curModule[curItem.method]);
		}else if(curItem.type=="post"){	
			router.route(curItem.path).post(curModule[curItem.method]);
		}else{
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		
		console.log("라우트 모듈 설정: " + curItem.method);
	}
	
	app.use("/",router);
	
};


module.exports = routerLoader;


















