const User = function(id, name) {
  this.id = id;
  this.name = name;
};

User.prototype.group = { id: 'inna', name: '인나' };



User.prototype.printUser = function() {
  console.log('id: ' + this.id + ', name: ' + this.name);
  console.log('id: ' + this.group.id + ', name: ' + this.group.name);

};

module.exports = User;