const net = require("net")
const SERVER = "103.17.181.123"
const PORT = 8080

let client = new net.Socket()

function connect() {
    console.log("[" + SERVER + ":" + PORT + "] " + "Telnet Connection STARTED")
    client.connect(
        PORT,
        SERVER,
        () => {
            console.log("[" + SERVER + ":" + PORT + "] " + "Telnet CONNECTED")
            // client.write("Hello, server! Love, Client.")
        }
    )

    client.on("data", data => {
        console.log("[" + SERVER + ":" + PORT + "] " + "Telnet DATA", " Received: " + data)
    })

    client.on("close", () => {
        console.log("[" + SERVER + ":" + PORT + "] " + "Telnet Connection CLOSED")
        reconnect()
    })

    client.on("end", () => {
        console.log("[" + SERVER + ":" + PORT + "] " + "Telnet Connection ENDED")
        reconnect()
    })

    client.on("error", console.error)
}

// function that reconnect the client to the server
reconnect = () => {
    setTimeout(() => {
        console.log("[" + SERVER + ":" + PORT + "] " + "Telnet RECONNECT")
        client.removeAllListeners() // the important line that enables you to reopen a connection
        connect()
    }, 600000) // 10 mins
}

connect()