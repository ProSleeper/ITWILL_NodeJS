//콜백함수
//비동기방식 코딩

const add = (a, b, callback) => {
  let result = a + b;

  callback(result);

}

add(10, 20, (result) => {
  console.log("결과:" + result);
});

