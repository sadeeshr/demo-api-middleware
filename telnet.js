const Telnet = require('telnet-client')
const connection = new Telnet()
let timer = null

const params = {
    host: '103.17.181.123',
    port: 8080,
    // shellPrompt: '/ # ',
    timeout: 1500,
    // removeEcho: 4
}

connection.on('ready', function (prompt) {
    console.log('server connnected !')
    // if (timer)
    // clearInterval(timer)
})

connection.on('timeout', function () {
    console.log('server connection timeout!')
    connection.end()
    // timer = setInterval(() => connection.connect(params), 2000);
})

connection.on('close', function () {
    console.log('server connection closed')
    setTimeout(() => {
        connection.connect(params)
    }, 600000); // 10 mins
})

connection.connect(params)