var socket = io.connect();

function key(event, type) {
  if (!event) { event = window.event }
  var code = event.keyCode;
  if (event.charCode && code == 0) { code = event.charCode }

  var key = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  }[code]

  if (!key) { return }
  console.log(key, 'key')
  socket.emit(`key-${ type }`, { key: key });
  event.preventDefault();
};

socket.on('kill-all', function () {
  console.log('kill-all-all');
  $('.arrow.active').removeClass('active');
});

socket.on('set-key', function (data) {
  console.log('set-key', data);
  $(`#${ data.key }-arrow`).addClass('active');
});

document.onkeyup = function(event) { key(event, 'release') };
document.onkeydown = function(event) { key(event, 'press') };