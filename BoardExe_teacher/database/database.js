
var mongoose = require("mongoose");

//database 객체에 db,schema,model모두 추가
var database = {};

database.init = function(app,config){
	
	connect(app,config);
	
}

//데이터베이스에 연결하고 응답객체의 속성으로 db객체 추가
function connect(app, config){
	
	console.log("connect 호출");
	
	//데이터베이스 연결
	mongoose.connect(config.dbUrl);
	database = mongoose.connection;
	
	database.on("open",function(){
		
		console.log("데이터베이스에 연결되었습니다.: " + config.dbUrl);
		
		createSchema(app,config);
		
	});
	
	database.on("error",console.error.bind(console,"몽구스 연결 에러..."));
	
	database.on("disconnected",function(){
		
		console.log("데이터베이스 연결이 끊겼습니다");
		setInterval(connectDB,5000);
		
	});
};

function createSchema(app,config){
	
	var schemaLen = config.dbSchemas.length;
	
	for(var i=0;i<schemaLen;i++){
		
		var curItem = config.dbSchemas[i];
		
		//모듈파일에서 모둘을 호출한후 createSchema()함수 호출
		var curSchema = require(curItem.file).createSchema(mongoose);
		
		//모델 정의
		var curModel = mongoose.model(curItem.collection,curSchema);
		
		//database객체에 스키마와 모델을 속성으로 추가
		database[curItem.schemaName] = curSchema;
		database[curItem.modelName] = curModel;
		
	}
	
	//app.set("port",process.env.PORT||3000);
	app.set("database",database);//db + Schema + Model	
	
}

module.exports = database;





























