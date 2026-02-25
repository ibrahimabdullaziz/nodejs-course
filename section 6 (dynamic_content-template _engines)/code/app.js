// const http = require("http");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

const handlebars = require("express-handlebars");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  handlebars({
    layoutDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  }),
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use("/admin", adminData.router);
app.use(shopRouter);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", { pageTitle: "page not found!!!" });
});

// const server = http.createServer(app);
// server.listen(5000);
app.listen(5000);
