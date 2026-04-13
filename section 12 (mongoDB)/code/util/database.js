require("dotenv").config();

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const connectClient = (callback) => {
  mongoClient
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iqqljmr.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority`,
      {
        serverSelectionTimeoutMS: 30000,
        tls: true
      }
    )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database connection");
};

exports.connectClient = connectClient;
exports.getDb = getDb;
