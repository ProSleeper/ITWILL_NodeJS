const user = require('./user5');

console.log(user);

const showId = () => {
  return user.getUser().id + ':' + user.group.id;
};

const showName = () => {
  return user.getUser().name + ':' + user.group.name;
};

console.log('아이디 정보: ' + showId());
console.log('이름 정보: ' + showName());