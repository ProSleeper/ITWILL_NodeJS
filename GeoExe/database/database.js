const mongoose = require('mongoose');
//const schema = require('coffeeshopSchema')

let database = {};

database.init = (app, config) => {
  connect(app, config)
  
};

const connect = (app, config) => {
  console.log('connect 호출됨');
  
   //데이터베이스 연결
  mongoose.connect(config.dbUrl);
 
  database = mongoose.connection;
  
  database.on("open", () => {
    console.log("데이터베이스에 연결 되었습니다." + config.dbUrl);

    createSchema(app, config);
  });
  database.on("error", console.error.bind(console, "몽구스 연결 에러."));

  //DB와 재연결 시도
  database.on("disconnected", () => {
    console.log("DB와 연결이 끊겼습니다. 5초 후 재연결 합니다.");
    setInterval(() => {
      connectDB();
    }, 5000);
  });
};

const createSchema = (app, config) => {
  
  //1const schemaLen = config.dbSchemas.length;  //1

 //1for(let index = 0; index < schemaLen; index++){
  config.dbSchemas.forEach((element, index) => {
    
    //1const curItem = config.dbSchemas[index];
    const curItem = element;

    //모듈을 불러와서 스키마 생성
    const curSchema = require(curItem.file).createSchema(mongoose);
    
    //모듈을 불러와서 모델 생성
    const curModel = mongoose.model(curItem.collection, curSchema);

    //database 객체의 속성에 schema와 model 추가
    
    database[curItem.schemaName] = curSchema;
    database[curItem.modelName] = curModel;
  });//1
  app.set('database', database);  //db + schema + model
}

module.exports = database;