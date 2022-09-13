/*
배열 만들고 요소 추가하기

push() : 마지막에 데이터 추가
pop() : 마지막 데이터 삭제
unshift() : 맨앞에 데이터 추가
shift() : 맨앞에 데이터 삭제
splice() : 여러 데이터 추가/삭제
slice() : 잘라내서 새로운 배열 만들기
*/


let Users = [{name:"수지", age:27}, {name:"인나", age:40}];

console.log(Users.length);

Users.push({name:"신혜", age:37})
console.log(Users.length);

console.log(Users[0].name);
console.log(Users[1].name);
console.log(Users[2].name);

console.log(Users); //Json 형태로 출력

Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
})

console.log('------------------------------------------------');

//삭제
Users.splice(0, 1);
Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
})


//배열에 함수 추가
let add = (a, b) => {
  return a + b;
}

Users.push(add)

console.log(Users[2](110, 20));

Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
});


console.log('------------------------------------------------');

//마지막에 데이터 추가
Users.push({ name: '효리', age: 40 });
Users.push({ name: '인선', age: 30 });

Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
});

console.log('------------------------------------------------');

//마지막 데이터 삭제
Users.pop();
Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
});

console.log('------------------------------------------------');

//맨 처음 데이터 삭제
Users.shift();
Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
});

console.log('------------------------------------------------');

//맨 처음 데이터 추가
Users.unshift({name:"정아", age:30})
Users.forEach((item, index) => {
  console.log(`${index}:${item.name}:${item.age}`);
});

console.log('------------------------------------------------');

//중간 데이터 삭제
delete Users[1];
//pop으로 지우는 것과 달리 delete로 지우면 key와 value를 모두 지우지만 공간은 그대로 남아있다. 출력해보면 <1 empty item> 이런 형식으로 출력된다.

try {
  Users.forEach((item, index) => {
    console.log(`${index}:${item.name}:${item.age}`);
  });
} catch (error) {
  
}


console.log("--------------------------------------------------")
console.log(Users.length);



// for (let i = 0; i < Users.length; i++) {
//   console.log(Users[i].name + ":" + Users[i].age);
// }

console.log('------------------------------------------------');

Users.splice(1, 0, { name: "인선", age: 30 });

console.dir(Users);

// Users[2] = ({ name: "영지", age: 25 });//이렇게 직접 배열의 index에 접근해서는 데이터를 넣는 것이 가능하다.

Users.splice(2, 1);
console.dir(Users);

//slice
let Users2 = Users.slice(1, 3); //index 1부터 3전까지 1<= x < 3 

console.dir(Users);
console.dir(Users2);

console.log('------------------------------------------------');

let Users3 = Users.splice(1); //처음부터 끝까지 복사

console.dir(Users);
console.dir(Users3);


