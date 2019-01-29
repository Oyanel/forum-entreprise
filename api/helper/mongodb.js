let config = require('../../config');
let mongoose = require('mongoose');

class Connection {
    static connectToMongo() {
        if (this.db) return Promise.resolve(this.db);
        return mongoose.connect(this.url, this.options)
            .then(db => this.db = db);
    }
}

Connection.db = null;
// let mongoUrl = "mongodb://" + config.mongodb.user + ":" + config.mongodb.password + "@" +
//     config.mongodb.url + config.mongodb.database;
let mongoUrl = "mongodb://" + config.mongodb.url + config.mongodb.database;
Connection.url = mongoUrl;
Connection.options = {
    bufferMaxEntries: 0,
    reconnectTries: 5000,
    useNewUrlParser: true
};

module.exports = {Connection};