var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);
var _ = require('lodash');
var car = require('./car.js');

server.listen(3001);
app.use(express.static('public'));

io.set('heartbeat timeout', 2000);
io.set('heartbeat interval', 1000);

var currentAction = {};

function act() {
  const action = {
    'up': car.forward,
    'right': car.right,
    'down': car.reverse,
    'left': car.left,
  }[currentAction.key] || car.stop;

  action();

  console.log('\n\naction called: ', currentAction.key);
  car.pinStatus();
}


// actions
function killAll() {
  currentAction = {};
  act();
  io.emit('kill-all');
}
var debouncedKill = _.debounce(killAll, 2000);

function killClientActions(socketId) {
  if (currentAction.socketId === socketId) { killAll() }
}

var throttleSetKey = _.throttle(function setKey(key) {
  act();
  io.emit('set-key', { key });
}, 500, { trailing: false });

function someOneElseHazLock(socketId) {
  return currentAction.socketId && currentAction.socketId !== socketId;
}

function onKeyPress(key, socketId) {
  if (someOneElseHazLock(socketId)) { return } // actions are locked to one session
  if (currentAction.key !== key) { killAll() }
  currentAction = { key, socketId };

  throttleSetKey(key);
  debouncedKill();
}

function onKeyRelease(key, socketId) {
  if (someOneElseHazLock(socketId)) { return } // actions are locked to one session
  if (currentAction.key === key) { killAll() }
}


// connections
function onConnected(socket) {
  socket.id = Math.floor(Math.random() * 100000);
  console.log('connected', socket.id);
}

function onDisconnected(id) {
  console.log('disconnect', id);
  killClientActions(id);
}

// Socket.io
io.sockets.on('connection', function (socket) {
  onConnected(socket);

  socket.on('key-press', function (data) {
    onKeyPress(data.key, socket.id);
  });

  socket.on('key-release', function (data) {
    onKeyRelease(data.key, socket.id);
  });

  socket.on('disconnect', function () { onDisconnected(socket.id) });
});

console.log("running");

process.on('SIGINT', function() {
  console.log('cleaning up');
  car.tearDown();
  process.exit();
});
