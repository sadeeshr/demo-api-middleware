const express = require('express')
const app = express()
const redis = require('redis')
const config = require('./config');
const client = redis.createClient({password: config.db.password})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(config.app.port, () => console.log(`API Middleware app listening on port ${port}!`))
