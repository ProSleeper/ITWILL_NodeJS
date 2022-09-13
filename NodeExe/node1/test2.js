/**
  * 1. 객체 사용(module.exports)
  var calc = {};
  
  calc.add=function(a, b){
    return a + b;
  }
 
  calc.mul = function(a ,b){
    return a * b;
  }
 
  module.exports=calc;
 
  2. 속성 사용(exports)
 
 exports.add = (a, b) => {
   return a + b;
 }
 
 exports.mul = (a, b) => {
   return a * b;
 }
 
 */

 
//모듈 분리 전 add함수

let calc = {};

calc.add = (a, b) => {
  return a + b;
}

console.log(calc.add(10, 20));


let calc1 = require('./calc1');
console.log(calc1.mul(10, 20));

let calc2 = require('./calc2')
console.log(calc2.div(200, 10));












