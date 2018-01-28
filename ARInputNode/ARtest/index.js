
const socket = io();
let prevGrabVal = 0;
let actionEl;

Leap.loop({
  enableGestures: true
}, frame => {
  if (frame.hands.length > 0) {
    const hand = frame.hands[0];
    const nextGrabVal = hand.grabStrength > 0.8 ? 1 : 0;

    if (nextGrabVal === prevGrabVal) return;
    prevGrabVal = nextGrabVal;

    if (actionEl !== undefined) {
      actionEl.innerHTML = nextGrabVal ?
          String.fromCodePoint('✊') :
          String.fromCodePoint('✋');
    }

    socket.emit('grab', nextGrabVal);
  }
});

socket.on('connect', () => {
  console.log('Connected to server.');
});

function onLoad() {
  actionEl = document.getElementById('action-indicator');

  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'w':
        socket.emit('move', 180);
        actionEl.innerHTML = '↙️';
        break;
      case 'a':
        socket.emit('spin', -180);
        actionEl.innerHTML = '↘️';
        break;
      case 's':
        socket.emit('move', -180);
        actionEl.innerHTML = '⬇️';
        break;
      case 'd':
        socket.emit('spin', 180);
        actionEl.innerHTML = '⬆️';
        break;
      case 'c':
        socket.emit('clear frames');
        actionEl.innerHTML = '🗑️';
        break;
      default:
        break;
    }
  });
}

window.onload = onLoad;
