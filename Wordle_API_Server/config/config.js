module.exports = {
  serverPort: 3000,

  //라우터
  routeInfo: [
    {
      file: "./user",
      path: "/index",
      method: "index",
      type: "get",
    },
    {
      file: "./user",
      path: "/test",
      method: "test",
      type: "get",
    },
    {
      file: "./user",
      path: "/",
      method: "basic",
      type: "get",
    },
  ],
};
