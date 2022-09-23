
//crypto 모듈
var crypto = require("crypto");

var Schema = {};

Schema.createSchema = function(mongoose){
	
	UserSchema = mongoose.Schema({
		  email: {type: String, required: true, unique: true},
		  hashed_password: {type: String, required: true},
		  salt: {type:String, required: true},
		  name: {type: String, index: "hashed"},		  
		  created: {type: Date, index: {unique: false}, "default": Date.now}
		});
	
		//virtual 속성
		UserSchema
		.virtual("password")
		.set(function(password){
			
			this._password = password;
			this.salt = this.makeSalt();
			this.hashed_password = this.encryptPassword(password);
		})
		.get(function(){
			return this._password;
		});
	
		// 스키마에 method로 추가
		UserSchema.method("encryptPassword",function(inputPwd,inSalt){
			
			if(inSalt){
				return crypto.createHmac("sha1",inSalt).update(inputPwd).digest("hex");
			}else{
				return crypto.createHmac("sha1",this.salt).update(inputPwd).digest("hex");
			}
			
		});
	
		UserSchema.method("makeSalt",function(){
			
			//console.log("date: " + new Date().valueOf());//1572856039737
			//console.log("math: " + Math.random()); //0.8524552533483953
			
			return Math.round((new Date().valueOf() * Math.random())) + "";
			
		});
		
		//인증 메소드(입력된 비밀번호와 비교)
		UserSchema.method("authenticate",function(inputPwd,inSalt,hashed_password){
			
			if(inSalt){
				
				console.log("inputPwd: " + inputPwd);
				console.log("encryptPassword: " + this.encryptPassword(inputPwd,inSalt));
				console.log("hashed_pasword: " + hashed_password);
				
				return this.encryptPassword(inputPwd,inSalt)==hashed_password;
				
			}else{
				
				console.log("inputPwd: " + inputPwd);
				console.log("encryptPassword: " + this.encryptPassword(inputPwd));
				console.log("hashed_pasword: " + hashed_password);
				
				return this.encryptPassword(inputPwd)==this.hashed_password;
				
			}
			
		});
	
		
		//스키마 객체에 메소드 추가(static(), method() : 2가지 방법)
		
		// 스키마에 static으로 findById 메소드 추가(로그인에서 사용)	
		UserSchema.static('findByEmail', function(email, callback) { 
			return this.find({email:email}, callback);
		});
		
		// 스키마에 static으로 findAll 메소드 추가(전체데이터 가져오기)	
		UserSchema.static("findAll", function(callback){
			return this.find({}, callback);
		});			
		
		console.log("UserSchema 정의함");		
	
		return  UserSchema;
	
};

module.exports = Schema;
