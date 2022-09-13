// * 전역 객체와 메소드
// * console 객체의 메소드 종류(dir,time,timeEnd)
// * process 객체의 메소드 종류(argv, env, exit)
// * exports 객체의 메소드 종류

let result = 0;

console.time("계산 시간");

for (let i = 0; i < 10000; i++) {
  result += i;
}

console.timeEnd("계산 시간");

console.log("1부터 10000의 합" + result);

console.log("파일이름: " + __filename);
console.log("파일경로: " + __dirname);

const Person = { name: "배수지", age: 27 };
console.log(Person);
console.dir(Person);  //객체의 속성 출력

console.dir(process.argv.length);

process.argv.forEach((item, index) => {
  console.log(index + ":" + item);
});

//환경변수
console.log(process.env);



