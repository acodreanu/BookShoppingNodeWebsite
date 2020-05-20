const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://NodeUser:KMsonh2fJAIFZtxU@nodecluster-7mb78.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((result) => {
      console.log('Connected!');
      _db = result.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
