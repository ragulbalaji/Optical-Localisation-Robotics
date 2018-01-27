
const socket = io();
let prevGrabVal = 0;
let grabStrengthEl;

Leap.loop({
  enableGestures: true
}, frame => {
  if (frame.hands.length > 0) {
    const hand = frame.hands[0];
    const nextGrabVal = hand.grabStrength > 0.8 ? 1 : 0;

    if (nextGrabVal === prevGrabVal) return;
    prevGrabVal = nextGrabVal;

    if (grabStrengthEl !== undefined) {
      grabStrengthEl.innerHTML = nextGrabVal;
    }

    socket.emit('grab', nextGrabVal);
  }
});

socket.on('connect', () => {
  console.log('Connected to server.');
});

function onLoad() {
  grabStrengthEl = document.getElementById('grab-strength');

  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'w':
        socket.emit('move', 180);
        break;
      case 'a':
        socket.emit('spin', -180);
        break;
      case 's':
        socket.emit('move', -180);
        break;
      case 'd':
        socket.emit('spin', 180);
        break;
      default:
        break;
    }
  });
}

window.onload = onLoad;
