const config = require('./config');
const mongojs = require('mongojs');
const dbURL = config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db
const collections = [];
const db = mongojs(dbURL, collections)

db.on('error', function (err) {
    console.log('database error', err)
})

db.on('connect', function () {
    console.log('database connected')
})

module.exports = {
    db: db,
    obj: mongojs
}