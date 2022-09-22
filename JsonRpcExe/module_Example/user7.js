// const User = (id, name) => {
//   this.id = id;
//   this.name = name;
// };

const User = function(id, name) {
  this.id = id;
  this.name = name;
};

User.prototype.printUser = function() {
  console.log('id: ' + this.id + ', name: ' + this.name);
};

module.exports = new User('suzi', '배수지');