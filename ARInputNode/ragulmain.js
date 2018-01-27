var video, canvas, ctx, imageData, detector, posit;

var modelSize = 90.0; //millimeters

function onLoad() {
	video = document.getElementById("video");
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = parseInt(0.7 * 1280);
	canvas.height = (canvas.width * 9) / 16;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	if (navigator.getUserMedia) {

		function successCallback(stream) {
			if (window.webkitURL) {
				video.src = window.webkitURL.createObjectURL(stream);
			} else if (video.mozSrcObject !== undefined) {
				video.mozSrcObject = stream;
			} else {
				video.src = stream;
			}
		}

		function errorCallback(error) {}

		navigator.getUserMedia({
			video: true
		}, successCallback, errorCallback);

		detector = new AR.Detector();
		posit = new POS.Posit(modelSize, canvas.width);

		ctx.font = "20px Arial";
		ctx.filter = "contrast(1) saturate(1)"
		requestAnimationFrame(tick);
	}
}

function tick() {
	setTimeout(tick, 100);

	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		snapshot();

		var markers = detector.detect(imageData);
		//drawCorners(markers);
		drawId(markers);
		console.log(markers)
	}
}

function snapshot() {
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawCorners(markers) {
	var corners, corner, i, j;

	ctx.lineWidth = 3;

	for (i = 0; i !== markers.length; ++i) {
		corners = markers[i].corners;

		ctx.strokeStyle = "red";
		ctx.beginPath();

		for (j = 0; j !== corners.length; ++j) {
			corner = corners[j];
			ctx.moveTo(corner.x, corner.y);
			corner = corners[(j + 1) % corners.length];
			ctx.lineTo(corner.x, corner.y);
		}

		ctx.stroke();
		ctx.closePath();

		ctx.strokeStyle = "green";
		ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
	}
}

function drawId(markers) {
	var corners, corner, x, y, i, j;
	ctx.lineWidth = 3;

	for (var marker of markers) {
		center = [0, 0];
		for (var corner of marker.corners) {
			center[0] += corner.x / 4;
			center[1] += corner.y / 4;
		}

		//rotation = Math.atan2((center[1] - marker.corners[0].y), (marker.corners[0].x - center[0]));
		pose = posit.pose(marker.corners)
		geometry = updatePose("pose1", pose.bestError, pose.bestRotation, pose.bestTranslation);

		ctx.fillStyle = "blue";
		ctx.fillText(geometry.roll, marker.corners[0].x, marker.corners[0].y)
		ctx.fillStyle = "green";
		ctx.fillRect(center[0] - 15, center[1] - 15, 30, 30)
		ctx.strokeStyle = "red";
		ctx.beginPath()
		ctx.moveTo(center[0], center[1])
		ctx.lineTo(center[0] + ((50000/geometry.z) * Math.cos(geometry.roll)), center[1] + ((50000/geometry.z) * Math.sin(geometry.roll)))
		ctx.stroke()

		marker.center = center;
		marker.geometry = geometry;
	}
}

window.onload = onLoad;

function randHexColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function updatePose(id, error, rotation, translation) {
	var yaw = -Math.atan2(rotation[0][2], rotation[2][2]);
	var pitch = -Math.asin(-rotation[1][2]);
	var roll = Math.atan2(rotation[1][0], rotation[1][1]);
	return {
		x: (translation[0] | 0),
		y: (translation[1] | 0),
		z: (translation[2] | 0),
		roll: Math.PI - roll,
		pitch: pitch,
		yaw: yaw
	};
}

const socket = io()
socket.on('connect', () => {
	console.log('Connected to server.')
	socket.emit('send data', {}) // Dummy data
})
