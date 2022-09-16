const crypto = require("crypto"); //암호화(pwd + salt key)

const Schema = {};


//데이터베이스 스키마
Schema.createSchema = (mongoose) => {

  //스키마 정의
  const UserSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },  //암호화된 패스워드를 저장할 스키마
    salt: {type:String, required:true},
    name: { type: String, index: "hashed" },
    age: { type: Number, default: 20 },
    created: { type: Date, index: { unique: false }, default: Date.now },
  });
  console.log("UserSchema 정의함");

  UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptoPassword(password);
    
  })
  .get(function () {
    return this._password;
  })

  //salt값 생성
  UserSchema.method('makeSalt', function() {

    console.log('data: ' + new Date().valueOf());
    console.log('math: ' + Math.random());
    return (Math.round((new Date().valueOf() * Math.random())) + "");
  })

  //암호화 메소드
  UserSchema.method('encryptoPassword', function (inputPwd, inSalt) {
    
    if (inSalt) {
      console.log("여기");
      return crypto.createHmac('sha1', inSalt).update(inputPwd).digest('hex');
    }
    else {
      return crypto.createHmac('sha1', this.salt).update(inputPwd).digest('hex');
    }
  })

  //로그인할때 입력한 pwd와 저장되어있는 pwd를 비교
  UserSchema.method('authenticate', function (inputPwd, inSalt, hashed_password) {
    if (inSalt) {

      //사용자가 입력한 pwd
      console.log('사용자 입력 pwd: ' + inputPwd);
      console.log('암호화된 pwd: ' + this.encryptoPassword(inputPwd, inSalt));
      console.log('저장되어있는 pwd: ' + hashed_password);

      return this.encryptoPassword(inputPwd, inSalt) == hashed_password;
    }
    else {
        //사용자가 입력한 pwd
        console.log('사용자 입력 pwd: ' + inputPwd);
        console.log('암호화된 pwd: ' + this.encryptoPassword(inputPwd));
        console.log('저장되어있는 pwd: ' + hashed_password);

        return this.encryptoPassword(inputPwd) == this.hashed_password;
    }
    
  })

  //스키마 객체에 메소드를 추가(static(), method())
  UserSchema.static("findById", function (id, callback) {
    return this.find({ id: id }, callback);
  });

  UserSchema.static("findAll", function (callback) {
    return this.find({}, callback);
  });


  return UserSchema;
};

module.exports = Schema;