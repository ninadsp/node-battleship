var Room = require("./room").Room;

var roomCounter = 0;
var roomList = []; // Array containing all the roomIDs

var createRoom = function () {
    var roomId = "r2d2" + (roomCounter++);
    var room = Room(roomId);
    roomList.push(room);
    return roomId;
};

var joinRoom = function (roomId, clientId) {
    var i = 0;
    for (i = 0; i < roomList.length; i++) {
	if (roomList[i].getId() == roomId) {
	    roomList[i].addClient(clientId);
	    return;
	}
    }

    throw "Sorry, I can't find room " + roomId + " on my Marauder's map !!! ";
};

var placeShips = function (roomId, clientId, ships, readyCallback) {
    var i = 0;
    for (i = 0; i < roomList.length; i++) {
	if (roomList[i].getId() == roomId) {
	    roomList[i].placeShips(clientId, ships);
	    if (roomList[i].areClientsReady() &&
		readyCallback !== null &&
		typeof(readyCallback) === 'function') {
		readyCallback(roomList[i].getClientIds());
	    }
	    return;
	}
    }

    throw "Sorry, I can't find room " + roomId + " on my Marauder's map !!! ";
};

var fireShot = function (roomId, clientId, location) {
    var room = null, i = 0, ret;
    for (i = 0; i < roomList.length; i++) {
	if (roomList[i].getId == roomId) {
	    room = roomList[i];
	    return room.fireShot(clientId, location); // returns JSON object {type: , location: , ship: }
	}
    }

    throw "Sorry, I can't find room " + roomId + " on my Marauder's map !!! ";
};

exports.createRoom = createRoom;
exports.joinRoom = joinRoom;
exports.placeShips = placeShips;
exports.fireShot = fireShot;
