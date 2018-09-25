const express = require('express')
const cors = require('cors')
const redis = require('redis')
const config = require('./config');
const xmlparser = require('express-xml-bodyparser');
const util = require('util')

const app = express()
const rclient = redis.createClient({ password: config.db.secret })

app.use(express.json());
app.use(express.urlencoded());
app.use(xmlparser());
app.use(cors())
// app.use(function (req, res, next) {
//     console.log(req.headers.authorization);
//     if (!req.headers.authorization) {
//         return res.status(403).json({ error: 'No Credentials' });
//     }
//     next();
// });

app.get('/', (req, res) => res.sendStatus(404))
app.post('/', (req, res) => res.sendStatus(404))

app.post('/_api/put/', function (req, res) {
    // if (config.token.provider !== req.headers.authorization) {
    //     return res.status(403).json({ error: 'Invalid Authorization' });
    // }
    if (config.vendorIPWhiteList.indexOf(req.ip.split(':').pop()) === -1) {
        return res.status(403).json({ error: 'Invalid IP Address' });
    }
    if (req.body && Object.keys(req.body).length !== 0) {
        console.log(util.inspect(req.body, false, null, true /* enable colors */))
        let singleNumber = req.body["soap:envelope"]["soap:body"]["ns2:broadcast"][0]["singlenumber"][0]["number"][0]
        console.log("##### NUMBER ##### ", singleNumber)

        if (singleNumber) {
            rclient.hmset(singleNumber, req.body, function (err, reply) {
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
    if (config.clientIPWhiteList.indexOf(req.ip.split(':').pop()) === -1) {
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

// SAMPLE DATA

// [{
//         'ns2:broadcast':
//             [{
//                 '$': { 'xmlns:ns2': 'http://portability.teletech.si' },
//                 messageheader:
//                     [{
//                         messageid: ['d41cfe89-6bd1-4c4d-be8c-048b5934f39b'],
//                         messagename: ['Broadcast'],
//                         messageversion: ['1'],
//                         messagetype: ['Broadcast'],
//                         senderid: ['CRDB'],
//                         receiverid: ['9876'],
//                         timestamp: ['2018-09-25T15:14:33.399+06:00'],
//                         recipientno: ['57'],
//                         recipientso: ['57'],
//                         donorno: ['31'],
//                         donorso: ['31']
//                     }],
//                 processtype: ['MOBILE'],
//                 processname: ['All'],
//                 porteddate: ['2018-09-25T15:14:33.400+06:00'],
//                 singlenumber:
//                     [{
//                         number: ['8801380000057'],
//                         recipientrc: ['57'],
//                         donorrc: ['31'],
//                         nrhrc: ['31'],
//                         portedaction: ['INSERT']
//                     }],
//                 extension:
//                     [{
//                         '$': { encryptedKey: 'false', encryptedValue: 'false' },
//                         key: ['preliminaryProcess'],
//                         value:
//                             [{
//                                 _: 'Porting',
//                                 '$':
//                                 {
//                                     'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
//                                     'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
//                                     'xsi:type': 'xs:string'
//                                 }
//                             }]
//                     }]
//             }]
//     }]
