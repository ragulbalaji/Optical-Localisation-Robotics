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
	"F24": "24", // FOLLOW ME
	"F25": "25", // LOOK AT ME
	"F32": "32", // GRAB ME
	"F33": "33"  // COME TO ME LET GO
}

let recentFrame = {};

setInterval(mainLoop, 200);

function mainLoop() {
	if (isDefined(recentFrame[oID["Robot"]]) && isDefined(recentFrame[oID["F24"]])) { //MIRROR ROLL OF F24
		robotAngle = parseFloat(recentFrame[oID["Robot"]].geometry.roll)
		f24Angle = parseFloat(recentFrame[oID["F24"]].geometry.roll)
		goal = parseInt(-3 * (robotAngle - f24Angle));
		if (Math.abs(goal) > 0) sendNXT("s," + goal.toString())
	} else if (isDefined(recentFrame[oID["Robot"]]) && isDefined(recentFrame[oID["F25"]])) { // LOOKAT POINT WORK ON CERTAIN QUADS
		//YAMAETE KUDASAIIII
		robot = recentFrame[oID["Robot"]]
		f25 = recentFrame[oID["F25"]]
		robotAngle = parseFloat(robot.geometry.roll)
		//console.log(recentFrame[oID["Robot"]], recentFrame[oID["F25"]])
		angleToF25 = (robot.center[0] < f25.center[0] ? 0 : Math.PI) + getAngle(robot.center[0], robot.center[1], f25.center[0], f25.center[1])
		//console.log((180 / Math.PI) * robotAngle, (180 / Math.PI) * angleToF25)
		goal = Math.round(-5 * (robotAngle - angleToF25))
		if (Math.abs(goal) > 1) sendNXT("s," + goal.toString())
	} else if (isDefined(recentFrame[oID["Robot"]]) && isDefined(recentFrame[oID["F33"]])) {
		robot = recentFrame[oID["Robot"]]
		f33 = recentFrame[oID["F33"]]
		robotAngle = parseFloat(robot.geometry.roll)
		angleToF33 = (robot.center[0] < f33.center[0] ? 0 : Math.PI) + getAngle(robot.center[0], robot.center[1], f33.center[0], f33.center[1])
		//console.log((180 / Math.PI) * robotAngle, (180 / Math.PI) * angleToF33, Math.abs(robotAngle - angleToF33))
		if (Math.abs(robotAngle - angleToF33) > (2 / 180 * Math.PI)) {
			goal = Math.round(-5 * (robotAngle - angleToF33))
			if (Math.abs(goal) > 0) sendNXT("s," + goal.toString())
		} else {
			dist = distBetween(robot.center[0], robot.center[1], f33.center[0], f33.center[1])
			goal = Math.round(0.1 * dist)
			if (Math.abs(dist) > 300){
				sendNXT("d," + goal.toString())
			}else{
				sendNXT("g,0")
			}
		}
	} else if (isDefined(recentFrame[oID["Robot"]]) && isDefined(recentFrame[oID["F32"]])) {
		robot = recentFrame[oID["Robot"]]
		f32 = recentFrame[oID["F32"]]
		robotAngle = parseFloat(robot.geometry.roll)
		angleToF32 = (robot.center[0] < f32.center[0] ? 0 : Math.PI) + getAngle(robot.center[0], robot.center[1], f32.center[0], f32.center[1])
		//console.log((180 / Math.PI) * robotAngle, (180 / Math.PI) * angleToF32, Math.abs(robotAngle - angleToF32))
		if (Math.abs(robotAngle - angleToF32) > (2 / 180 * Math.PI)) {
			goal = Math.round(-5 * (robotAngle - angleToF32))
			if (Math.abs(goal) > 0) sendNXT("s," + goal.toString())
		} else {
			dist = distBetween(robot.center[0], robot.center[1], f32.center[0], f32.center[1])
			goal = Math.round(0.1 * dist)
			console.log(dist)
			if (Math.abs(dist) > 260){
				sendNXT("d," + goal.toString())
			}else{
				sendNXT("g,1")
			}
		}
	}
}

io.on('connection', socket => {
	console.log(`${socket.id} connected.`);
	socket.on('disconnect', () => console.log(`${socket.id} disconnected.`));
	socket.on('frame', data => {
		for (var marker of data) {
			marker.time = Date.now()
			recentFrame[marker.id] = marker
		}
	});
	socket.on('grab', data => {
		if (data === 1 || data === 0) {
			sendNXT(`g,${data.toString()}`);
		}
	});
	socket.on('move', data => {
		sendNXT(`d,${data.toString()}`);
	});
	socket.on('spin', data => {
		sendNXT(`s,${data.toString()}`);
	});
})

app.use('/', express.static(path.resolve('../ARInputNode')))

httpsServer.listen(8443, () => {
	console.log('Listening on port 8443')
})

setInterval(function () { //Stats Loop
	for (var key of Object.keys(recentFrame)) {
		var marker = recentFrame[key];
		if (marker.time < Date.now() - (marker.id === oID["Robot"] ? 200 : 20000)) delete recentFrame[key];
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
	//console.log(dy, dx)
	return Math.atan(dy / dx);
};

function distBetween(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};