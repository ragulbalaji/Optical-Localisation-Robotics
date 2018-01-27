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
const nxt = new net.Socket()
nxt.connect(8080, '192.168.43.177', () => {
  nxt.write('HELLO FROM NODE')
})

var recentFrame;
var stats = {
	last10seconds: 0
}

io.on('connection', socket => {
	console.log(`${socket.id} connected.`)
	socket.on('disconnect', () => console.log(`${socket.id} disconnected.`))
	socket.on('send data', data => {
		console.log(data)
	})

	socket.on('frame', data => {
		console.log(data.length)
		stats.last10seconds++;
		recentFrame = data;
	})
})

app.use('/', express.static(path.resolve('ARInputNode')))

httpsServer.listen(8443, () => {
	console.log('Listening on port 8443')
})

function stats(){
	
}