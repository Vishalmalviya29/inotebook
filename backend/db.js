// we are connecting to database in db.js

const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"

const connect_to_mongo = () => {
    mongoose.connect(mongoURI)
}

module.exports = connect_to_mongo;
