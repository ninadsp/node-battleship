
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('rootDirectory', __dirname);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/room/:roomID', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/**
 * Battleship stuff
 */

var server = require(app.get('rootDirectory') + '/controllers/Server.js');

var players = io.of('/battleships').on('connection', function(client) {
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
			console.log('clientID : ' client.id + ' , room joined : ' + roomID);
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
	})
});
