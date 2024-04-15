const proxy = require("http-proxy-middleware");
const express = require("express");
const app = express();

// const { HOST = "http://10.0.9.77:9032", PORT = "3300" } = process.env;

app.set("port", "3000");
// app.use((req, res, next) => {
//   if (!req.timedout) next();
// });

// app.use(express.static("./dist"));

// app.use(proxy("/", { target: HOST }));

app.listen(app.get("port"), () => {
  console.log(`server running @${app.get("port")}`);
});
app.get("http://10.0.9.77:9031/captchaImage", (req, res) => {
  console.log(res);
});
