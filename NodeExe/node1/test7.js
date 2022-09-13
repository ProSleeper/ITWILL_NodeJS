//클로져

const add = (a, b, callback) => {
  let result = a + b;

  callback(result);

  let history = () => {
    return a + "+" + b + "=" + result;
  }

  return history;
};

let history = add(10, 20, (result) => {
  console.log(result);
});

console.log(history());
