module.exports = {
  serverPort: 3000,
  dbUrl: "mongodb://localhost:27017/shopping",

  //schemaName: CoffeeShopSchema(./database/coffeeshopSchema.js)
  //modelName: CoffeeShopModel(./router/coffeeShop.js)
  dbSchemas:
    [
      // {
      //   file:'./userSchema', collection:'users4', schemaName:'UserSchema', modelName:'UserModel'
      // },
      {
        file:'./coffeeshopSchema', collection:'starbucks', schemaName:'CoffeeShopSchema', modelName:'CoffeeShopModel'
      }
    ],
  
    //라우터
  routeInfo:
    [
      {
        file:'./coffeeShop', path:'/process/addCoffeeShop', method:'add', type:'post'
      },
      {
        file:'./coffeeShop', path:'/process/listCoffeeShop', method:'list', type:'post'
      },
      {
        file:'./coffeeShop', path:'/process/nearCoffeeShop', method:'findNear', type:'post'
      },
      {
        file:'./coffeeShop', path:'/process/nearCoffeeShop2', method:'findNear2', type:'post'
      },
      {
        file:'./coffeeShop', path:'/process/withinCoffeeShop', method:'findWithin', type:'post'
      },
      {
        file:'./coffeeShop', path:'/process/circleCoffeeShop', method:'findCircle', type:'post'
      },
    ]
};

