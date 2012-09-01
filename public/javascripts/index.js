$(document).ready(function() {
	
	var socket = io.connect("/battleship");

	socket.on('connect', function(d) {
		var pathname = window.location.pathname;

		if(pathname == '/') {
			socket.emit('bsCreateRoom');
			console.log('Requesting server to create a room');
		}
		else if(pathname.search('/room/') != -1){
			var roomID = pathname.match(/\/room\/(\w+))[1];
			socket.emit('bsJoinRoom', { roomID: roomID });
			console.log('Requesting a join room on roomID : ' + roomID);
		}
		else {
			console.log('Incorrect URL');
		}
	});

	socket.on('bsRoomCreated', function(d) {
		console.log('Room created : ' + d.roomID);
	});

	socket.on('bsRoomJoined', function(d) {
		console.log('Room joined : ' + d.roomID);
	});

	socket.on('bsError', function(d) {
		console.log('Error received : ' + d);
	});

	socket.on('disconnect', function(d) {
		console.log('Disconnected');
	});
});
