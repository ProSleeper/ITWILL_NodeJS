const mongodb = require('mongodb');
const mongoose = require('mongoose');

let database = null;
let UserSchema = null;
let UserModel = null;

const connectionDB = () => {
  const databaseUrl = 'mongodb://localhost:27017/shopping';
  
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('open', () => {
    console.log('DB연결 됨');
    createUserSchema();
    insertData();
  })
};

const createUserSchema = () => {
  UserSchema = mongoose.Schema({
    id: String,
    name:String,
  })

  UserSchema.virtual("info")
    .set(function(info) {
      //virtual 함수가 처리하는 내용을 코딩
      //{'info':'suzi',배수지'
      const array = info.split(',');
      array.forEach((element, index) => {
        array[index] = array[index].trim();
        // console.log(element);
      })
      console.log(array[0]);
      console.log(array[1]);

      this.id = array[0];
      this.name = array[1];
    })
    .get(function(){
      return this.id + ':' + this.name;
    });

  UserModel = mongoose.model('user3', UserSchema);
}


const insertData = () => {
  const user = new UserModel({'info':'suzi, 배수지'});
  user.save((err, result) => {
    if (err) throw err;

    console.log('사용자 추가됨');

    findAll();
  })
};

const findAll = () => {
  UserModel.find({}, (err, result) => {
    if (err) throw err;

    if (result) {
      result.forEach((element, index) => {
        //console.log('id: %s, name: %s', element._doc.id, element._doc.name);
      });
    }
  })
};

connectionDB();