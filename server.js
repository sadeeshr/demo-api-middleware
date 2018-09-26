const express = require('express')
const cors = require('cors')
const xmlparser = require('express-xml-bodyparser');
const util = require('util')

const config = require('./config');

// const redis = require('redis') // REDIS
// const rclient = redis.createClient({ password: config.db.secret }) // REDIS
const mongo = require('./mongo') // MONGO

const app = express()

app.use(express.json());
// app.use(express.urlencoded());
app.use(xmlparser());
app.use(cors())

app.get('/', (req, res) => res.sendStatus(404))
app.post('/', (req, res) => res.sendStatus(404))

app.post('/_api/put/', function (req, res) {

    if (config.vendorIPWhiteList.indexOf(req.ip.split(':').pop()) === -1) {
        return res.status(403).json({ error: 'Invalid IP Address' });
    }
    // req.body = config.sample  // for testing with sample data
    req.body = JSON.parse(JSON.stringify(req.body).replace(/\$/g, "_$"))
    if (req.body && Object.keys(req.body).length !== 0) {
        console.log(util.inspect(req.body, false, null, true /* enable colors */))
        let singleNumber = req.body["soap:envelope"]["soap:body"][0]["ns2:broadcast"][0]["singlenumber"][0]["number"][0]
        console.log("##### NUMBER ##### ", singleNumber)

        if (singleNumber) {
            // REDIS
            // rclient.hmset(singleNumber, req.body, function (err, reply) {
            //     if (err)
            //         console.error(err)
            //     else
            //         console.log(reply);
            //     return res.sendStatus(200)
            // })

            // MONGO
            mongo.db[config.mongo.db].insert(
                {
                    number: singleNumber,
                    soapData: req.body
                }, (err, reply) => {
                    if (err || !reply)
                        console.log(err);
                    else
                        console.log(reply);
                    return res.sendStatus(200)
                })
        }
    } else
        return res.status(200).json({ error: 'EMPTY REQUEST' });
});

app.get('/_api/get/:phone', function (req, res) {

    if (config.clientIPWhiteList.indexOf(req.ip.split(':').pop()) === -1) {
        return res.status(403).json({ error: 'Invalid IP Address ' + req.ip });
    }

    // REDIS
    // rclient.hgetall(req.params.phone, function (err, reply) {
    //     if (err)
    //         console.error(err);
    //     else {
    //         console.log(reply);
    //         if (!reply)
    //             return res.status(200).json({ number: req.params.phone, error: 'NO DATA FOUND' });
    //         else
    //             return res.status(200).json(reply);
    //     }
    // });

    // MONGO
    mongo.db[config.mongo.db].find({ number: req.params.phone }, (err, data) => {
        if (err || !data) {
            console.error(err || "NO DATA");
            return res.status(200).json({ number: req.params.phone, error: 'NO DATA FOUND' });
        }
        else {
            return res.status(200).json(data);
        }
    });

})

app.listen(config.app.port, () => console.log(`API Middleware app listening on port ${config.app.port}!`))
