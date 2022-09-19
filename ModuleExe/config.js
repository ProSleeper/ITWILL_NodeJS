module.exports = {
  serverPort: 3000,
  dbUrl: "mongodb://localhost:27017/shopping",

  //schemaName: ./database/userSchema
  dbSchemas:
    [
      {
        file:'./userSchema', collection:'users3', schemaName:'UserSchema', modelName:'UserModel'
      }
    ],
  
    //라우터
  routeInfo:
    [
      {
        file:'./user', path:'/process/login', method:'login', type:'post'
      },
      {
        file:'./user', path:'/process/addUser', method:'addUser', type:'post'
      },
      {
        file:'./user', path:'/process/listUser', method:'listUser', type:'post'
      },
    ]
};
