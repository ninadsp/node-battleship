/**
 * Battleship stuff
 */

var init = function(app, httpServer) {
	console.log('sockets init');
	io = require('socket.io').listen(httpServer);

	io.configure(function() {
			io.enable('browser client minification');
			io.set('log level', 1);
			io.set('transports', [
					'websocket',
					'htmlfile',
					'xhr-polling',
					'jsonp-polling'
				]);
			});

	var Server = require(app.get('rootDirectory') + '/controllers/server.js');

	var players = io.of('/battleships').on('connection', function(client) {
			console.log('connection event for client : ' + client.id);
			client.emit('clientId', {id: client.id});

			client.on('bsCreateRoom', function(d) {
				try{
					var roomID = Server.createRoom();
					client.emit('bsRoomCreated', {roomID: roomID});
					console.log('clientID : ' + client.id + ' , room created : ' + roomID );
				}
				catch(e){
					client.emit('bsError', e);
					console.log('clientID : ' + client.id + ' , room create error : ' + e);
				}
				});

			client.on('bsJoinRoom', function(d) {
				try{
					var roomID = d.roomID;
					Server.joinRoom(roomID, client.id);
					client.emit('bsRoomJoined', {roomID : roomID});
					console.log('clientID : ' + client.id + ' , room joined : ' + roomID);
				}
				catch(e){
					client.emit('bsError', e);
					console.log('clientID : ' + client.id + ' , room join error : ' + e);
				}
				});

			client.on('bsPlaceShips', function(d) {
					});

			client.on('disconnect', function() {
					console.log('clientID : ' + client.id + ' , disconnected');
					});
	});
}

exports.init = init;
