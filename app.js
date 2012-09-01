
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
        app.use(express.static(__dirname + '/public/'));
        });

app.configure('development', function(){
        app.use(express.errorHandler());
        });

app.get('/', function(req, res) {
		console.log('/ request recieved');
		res.sendfile(__dirname + '/public/index.html');	
	});
app.get('/room/:roomID', function(req, res) {
		console.log('/room/ request recieved');
		res.sendfile(__dirname + '/public/index.html');
	});

var httpServer = http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
        });

var sockets = require('./sockets');

sockets.init(app, httpServer);
