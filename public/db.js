const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';
let db
// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
 const init = () => 
 MongoClient.connect(url, { useNewUrlParser: true }).then((client) => {
  db = client.db(dbName)
});

const addAgent = (agent) => {
  const collection = db.collection('agents')
  return collection.insertOne(agent)
}
const findAgent = () => {
  const collection = db.collection('agents')
  return collection.find({})
}
module.exports = { init, addAgent, findAgent}
