let Calc = function () {
  this.on('stop', () => {
    console.log('Cal에 stop 이벤트 전달됨...')
  })
};

//util.inherits: 상속을 가능하게 해주는 모듈
let util = require('util');

//EventEmitter는 events 모듈안에 정의 되어 있음
let eventEmitter = require('events').EventEmitter;

// public class Calc extends EventEmitter { }
util.inherits(Calc, eventEmitter);

module.exports = Calc;
module.exports.title = "계산기";