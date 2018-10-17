const net = require("net")

let client = new net.Socket()

function connect() {
    console.log("new client")
    client.connect(
        8080,
        '103.17.181.123',
        () => {
            console.log("Connected")
            // client.write("Hello, server! Love, Client.")
            client.end("INFIZILLION KEEP-ALIVE REQUEST")
        }
    )

    client.on("data", data => {
        console.log("Received: " + data)
    })

    client.on("close", () => {
        console.log("Connection closed")
        reconnect()
    })

    client.on("end", () => {
        console.log("Connection ended")
        reconnect()
    })

    client.on("error", console.error)
}

// function that reconnect the client to the server
reconnect = () => {
    client.removeAllListeners() // the important line that enables you to reopen a connection
    connect()
}

connect()