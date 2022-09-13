const fetch = require("node-fetch");

const testRequest = () => {
  return fetch('http://127.0.0.1:1337');
};

testRequest()
  .then((response) =>
    response.text())
  .then((message) =>
    console.log(message))

    