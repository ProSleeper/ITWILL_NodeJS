//노드의 자료형
//Boolean, Number, String, Undefined, null, Object
//Undefined: 값을 할당하지 않은 변수(단순히 값이 없음)
//null: 존재하지 않는 값(의도적으로 값이 없음)

let Person = {};
Person['name'] = '배수지';
Person['age'] = 27;
Person.mobile = '010-123-1234';


console.log(Person.name);
console.log(Person.age);
console.log(Person.mobile);

console.log(Person['name']);
console.log(Person['mobile']);

console.log('---------------------------------------');


//1. 일반 함수
function add1(a, b) {
  return a + b;
}

let result1 = add1(10, 20);
console.log(result1);

//2. 익명 함수
let add2 = function (a, b) {
  return a + b;
}

let result2 = add2(20, 30);
console.log(result2);

//3. 객체
let Person1 = {};
Person1['name'] = "유인나";
Person1['age'] = 40;
Person1.mobile = '010-123-1234';

Person1.add3 = function (a, b) {
  return a + b;
}

console.log(Person1.add3(40, 50));


//4.
let add4 = function (a, b) {
  return a + b;
}

Person1['add4'] = add4;
console.log(Person1.add4(100, 200));



//5. 

let Person2 = {
  name: "정인선",
  age: 27,
  add5: function (a, b) {
    return a + b;
  },
}

console.log(Person2.add5(50, 60));
console.log(Person2.name);

//객체의 속성을 만드는 방법









