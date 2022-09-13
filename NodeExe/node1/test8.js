//프로토타입 객체
//자바스크립트에서 객체의 원형을 지정한 후
//새로운 인스턴스 객체를 생성해서 사용

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.walk = function (speed) {
  
  if (speed > 30) {
    console.log(speed + "km 속도로 뛰어갑니다.");
    return;
  }
  console.log(speed + "km 속도로 걸어갑니다.");
};

let person1 = new Person("수지", 27);
let person2 = new Person("안젤리나", 25);

console.log(person1.name + "가 걸어갑니다.");
person1.walk(10);
console.log(person2.name + "가 뛰어갑니다.");
person2.walk(50);






