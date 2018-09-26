module.exports = {
  app: {
    port: 9898
  },
  mongo: {
    host: "127.0.0.1",
    port: "27017",
    db: "mnpdb"
  },
  vendorIPWhiteList: [
    "1",
    "114.108.201.50", //sadeesh
    "103.17.181.123",
    "103.17.181.124"
  ],
  clientIPWhiteList: [
    "1",
    "114.108.201.50", //sadeesh
  ],
  sample: {
    'soap:envelope':
    {
      '$': { 'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/' },
      'soap:body':
        [{
          'ns2:broadcast':
            [{
              '$': { 'xmlns:ns2': 'http://portability.teletech.si' },
              messageheader:
                [{
                  messageid: ['41b389a1-2a61-497c-88c7-4682a0644266'],
                  messagename: ['Broadcast'],
                  messageversion: ['1'],
                  messagetype: ['Broadcast'],
                  senderid: ['CRDB'],
                  receiverid: ['9876'],
                  timestamp: ['2018-09-25T16:18:11.263+06:00'],
                  recipientno: ['31'],
                  recipientso: ['31'],
                  donorno: ['21'],
                  donorso: ['21']
                }],
              processtype: ['MOBILE'],
              processname: ['All'],
              porteddate: ['2018-09-25T16:18:11.263+06:00'],
              singlenumber:
                [{
                  number: ['8801250000023'],
                  recipientrc: ['31'],
                  donorrc: ['21'],
                  nrhrc: ['21'],
                  portedaction: ['INSERT']
                }],
              extension:
                [{
                  '$': { encryptedKey: 'false', encryptedValue: 'false' },
                  key: ['preliminaryProcess'],
                  value:
                    [{
                      _: 'Porting',
                      '$':
                      {
                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                        'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
                        'xsi:type': 'xs:string'
                      }
                    }]
                }]
            }]
        }]
    }
  }
};