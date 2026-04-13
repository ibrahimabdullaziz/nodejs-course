require("dotenv").config();

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const connectClient = (callback) => {
  const uri =
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER || process.env.DB_HOST}/?appName=Cluster0&retryWrites=true&w=majority`;

  if (!uri || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error(
      "MongoDB connection details are not set. Define MONGODB_URI or DB_USER, DB_PASSWORD, and DB_CLUSTER/DB_HOST in the .env file.",
    );
  }

  mongoClient
    .connect(uri, {
      serverSelectionTimeoutMS: 30000,
      tls: true,
    })
    .then((client) => {
      const dbName = process.env.DB_NAME;
      _db = dbName ? client.db(dbName) : client.db();
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
