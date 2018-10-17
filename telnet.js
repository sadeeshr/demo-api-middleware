const net = require("net")
const SERVER = "103.17.181.123"
const PORT = 8080

let client = new net.Socket()

function connect() {
    console.log("[" + Date() + " : " + SERVER + ":" + PORT + "] " + "Telnet Connection STARTED")
    client.connect(
        PORT,
        SERVER,
        () => {
            console.log("[" + Date() + " : " + SERVER + ":" + PORT + "] " + "Telnet CONNECTED")
            client.end("INFIZILLION KEEP-ALIVE REQUEST")
            setTimeout(reconnect, 300000);
        }
    )

    client.on("data", data => console.log("[" + Date() + " : " + SERVER + ":" + PORT + "] " + "Telnet DATA", " Received: " + data))

    client.on("close", () => console.log("[" + Date() + " : " + SERVER + ":" + PORT + "] " + "Telnet Connection CLOSED"))

    client.on("end", () => console.log("[" + Date() + " : " + SERVER + ":" + PORT + "] " + "Telnet Connection ENDED"))

    client.on("error", console.error)
}

reconnect = () => {
    console.log("[" + Date() + " : " + SERVER + ":" + PORT + "] " + "Telnet RECONNECT")
    client.removeAllListeners()
    connect()
}

connect()
