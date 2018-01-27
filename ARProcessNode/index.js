//const server = require('http').Server(app)
const https = require('https');
const fs = require('fs');

//openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	passphrase: "password"
};

const express = require('express')
const app = express()

const httpsServer = https.createServer(credentials, app);

const io = require('socket.io')(httpsServer)
const path = require('path')

const net = require('net')
const s = new net.Socket()
//s.connect(8080, '192.168.43.177', () => {
//  s.write('HELLO FROM NODE')
//})

let recentFrame = {};

io.on('connection', socket => {
	console.log(`${socket.id} connected.`)
	socket.on('disconnect', () => console.log(`${socket.id} disconnected.`))
	socket.on('send data', data => {
		console.log(data)
	})

	socket.on('frame', data => {
		for (var marker of data) {
			marker.time = Date.now()
			recentFrame[marker.id] = marker
		}
	})
})

app.use('/', express.static(path.resolve('ARInputNode')))

httpsServer.listen(8443, () => {
	console.log('Listening on port 8443')
})

setInterval(function () { //Stats Loop
	for (var key of Object.keys(recentFrame)) {
		var marker = recentFrame[key];
		if (marker.time < Date.now() - 10000) delete recentFrame[key];
	}
	console.log(Object.keys(recentFrame))
}, 2000)