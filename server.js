const express = require('express')
const cors = require('cors')
const redis = require('redis')
const config = require('./config');
const path = require('path')
const app = express()
const rclient = redis.createClient({ password: config.db.secret })

app.use(express.json());
app.use(cors())
// app.use(function (req, res, next) {
//     console.log(req.headers.authorization);
//     if (!req.headers.authorization) {
//         return res.status(403).json({ error: 'No Credentials' });
//     }
//     next();
// });

app.get('/', (req, res) => res.sendStatus(404))
app.get('/loaderio-cf23489ab7c0814313259dcc08b16468', (req, res) => res.sendFile(path.join(__dirname, '../_api', "loaderio-cf23489ab7c0814313259dcc08b16468.txt")))
app.post('/', (req, res) => res.sendStatus(404))

app.post('/_api/put/', function (req, res) {
    console.log(req.body);
    // if (config.token.provider !== req.headers.authorization) {
    //     return res.status(403).json({ error: 'Invalid Authorization' });
    // }
    if (config.vendorIPWhiteList.indexOf(req.ip) === -1) {
        return res.status(403).json({ error: 'Invalid IP Address' });
    }
    if (req.body && Object.keys(req.body).length !== 0) {
        let data = req.body
        if (data.singleNumber && data.singleNumber.number) {
            rclient.hmset(data.singleNumber.number, data, function (err, reply) {
                if (err)
                    console.error(err)
                else
                    console.log(reply);
                return res.sendStatus(200)
            })
        }
    } else
        return res.status(200).json({ error: 'EMPTY REQUEST' });
});

app.get('/_api/get/:phone', function (req, res) {
    // if (config.token.client !== req.headers.authorization) {
    //     return res.status(403).json({ error: 'Invalid Authorization' });
    // }
    if (config.clientIPWhiteList.indexOf(req.ip) === -1) {
        return res.status(403).json({ error: 'Invalid IP Address ' + req.ip });
    }
    rclient.hgetall(req.params.phone, function (err, reply) {
        if (err)
            console.error(err);
        else {
            console.log(reply);
            if (!reply)
                return res.status(200).json({ number: req.params.phone, error: 'NO DATA FOUND' });
            else
                return res.status(200).json(reply);
        }
    });
})

app.listen(config.app.port, () => console.log(`API Middleware app listening on port ${config.app.port}!`))
