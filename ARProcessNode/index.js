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

const oID = {
	"Robot": "28",
	"F24": "24",
	"F25": "25"
}

let recentFrame = {};

setInterval(mainLoop, 100);

function mainLoop() {
	if (isDefined(recentFrame[oID["Robot"]]) && isDefined(recentFrame[oID["F24"]])) { //MIRROR ROLL OF F24
		robotAngle = parseFloat(recentFrame[oID["Robot"]].geometry.roll)
		f24Angle = parseFloat(recentFrame[oID["F24"]].geometry.roll)
		goal = parseInt(-3 * (robotAngle - f24Angle));
		if (Math.abs(goal) > 0) sendNXT("s," + goal.toString())
	} else if (isDefined(recentFrame[oID["Robot"]]) && isDefined(recentFrame[oID["F25"]])) { //NO WORK
		//robotAngle = parseFloat(recentFrame[oID["Robot"]].geometry.roll)
		//goal = Math.round(3 * Math.sin(Date.now() / 500)) 
		//console.log(goal);
		//if (Math.abs(goal) > 0) sendNXT("s," + goal.toString())
	}
}

io.on('connection', socket => {
	console.log(`${socket.id} connected.`)
	socket.on('disconnect', () => console.log(`${socket.id} disconnected.`))
	socket.on('frame', data => {
		for (var marker of data) {
			marker.time = Date.now()
			recentFrame[marker.id] = marker
		}
	})
	socket.on('grab', data => {
		const grabVal = data.toString()
		sendNXT('g,' + grabVal)
		console.log(grabVal)
	})
})

app.use('/', express.static(path.resolve('../ARInputNode')))

httpsServer.listen(8443, () => {
	console.log('Listening on port 8443')
})

setInterval(function () { //Stats Loop
	for (var key of Object.keys(recentFrame)) {
		var marker = recentFrame[key];
		if (marker.time < Date.now() - 100) delete recentFrame[key];
	}
	console.log(Object.keys(recentFrame))
}, 2000)

var sendBlocker = false;

function sendNXT(msg) {
	if (sendBlocker) {
		return "Busy";
	} else {
		sendBlocker = true
		const nxt = new net.Socket()
		try {
			console.log("Attempt Send")
			nxt.connect(8080, '192.168.43.177', (err) => {
				if (err !== undefined) {
					sendBlocker = false
					console.log("DED", err)
					return;
				}
				console.log("Sending.. ", msg)
				nxt.write(msg)
				nxt.end()
				sendBlocker = false
			})
		} catch (e) {
			next(e)
		}
	}
}

function isDefined(obj) {
	return !(obj === undefined);
}

function getAngle(x1, y1, x2, y2) {
	var dx = x1 - x2,
		dy = y1 - y2;
	return Math.atan2(dy, dx);
};