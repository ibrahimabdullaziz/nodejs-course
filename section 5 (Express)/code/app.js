// const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(shopRouter);
app.use(adminRouter);

// const server = http.createServer(app);
// server.listen(5000);
app.listen(5000);
