// const http = require("http");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const router = require("./routes/admin");
const shopRouter = require("./routes/shop");

const errorController = require("./controllers/error");

// const handlebars = require("express-handlebars");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// app.engine(
//   "hbs",
//   handlebars({
//     layoutDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   }),
// );

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/admin", router);
app.use(shopRouter);

app.use(errorController.notFound);

// const server = http.createServer(app);
// server.listen(5000);
app.listen(5000);
