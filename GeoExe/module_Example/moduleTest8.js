//3. 프로토타입 객체를 할당(모듈을 불러온 후 new로 객체생성 후 실행)

const User = require('./user8');
const user = new User('insun', '린선');

user.printUser();