var Client = function(clientId) {
    var _id = clientId;
    var _ships = [];

    var shipMaxCounts = {
	carrier: 1,
	battleship: 1,
	submarine: 1,
	destroyer: 2,
	boat: 2
    };

    var getId = function() {
	return _id;
    };

    var validateShipCount = function(ship, counts) {
	if (!shipMaxCounts.hasOwnProperty(ship.type)) {
	    throw "Unknown ship type " + ship.type;
	}
	else {
	    if (shipMaxCounts[ship.type] <= counts[ship.type]) {
		throw "Cannot create more than " + shipMaxCounts[ship.type] + " ships of type " + ship.type;
	    }
	}
    };

    var placeShips = function(ships) {
	var i, j;

	var counts = {
	    carrier: 0,
	    battleship: 0,
	    submarine: 0,
	    destroyer: 0,
	    boat: 0
	};

	// validate number of ships
	if (ships.length !== 7) {
	    throw "Cannot create more than 7 ships";
	}

	for (i = 0; i < ships.length; i += 1) {
	    try {
		validateShipCount(ships[i], counts);
		counts[ships[i].type] += 1;
	    }
	    catch(e) {
		throw e;
	    }

	    // validate locations
	    if (ships[i].cellsOccupied[0] < 1 ||
		ships[i].cellsOccupied[1] > 10) {
		throw "Invalid location " + ships[i].cellsOccupied + " for ship of type " + ships[i].type;
	    }
	}

	for (i = 0; i < ships.length; i += 1) {
	    ships[i].cellsHit = [];
	}

	_ships = ships;
    };

    var checkForHit = function(location) {
	var i, j;

	var shotResult = {
	    location: location,
	    type: "miss",
	    ship: []
	};

	for (i = 0; i < _ships.length; i += 1) {
	    for (j = 0; j < _ships[i].cellsOccupied.length; j += 1) {
		if (_ships[i].cellsOccupied[j][0] === location[0] &&
		    _ships[i].cellsOccupied[j][1] === location[1]) {
		    // Mark the hit first
		    _ships[i].cellsHit.push(location);
		    if (_ships[i].cellsHit.length === _ships[i].cellsOccupied.length) {
			shotResult.type = "sink";
			shotResult.ship = _ships[i].cellsOccupied;
		    }
		    else {
			shotResult.type = "hit";
			shotResult.ship = [];
		    }
		}
	    }
	}

	return shotResult;
    };

    return {
	getId: getId,
	placeShips: placeShips,
	checkForHit: checkForHit
    };
};

var Room = function(roomName) {
    var _name = roomName;
    var _clients = [];

    var getName = function() {
	return _name;
    };

    var addClient = function(clientId) {
	var newClient = Client(clientId);
	_clients.push(newClient);
    };

    var placeShips = function(clientId, ships) {
	var i;
	for (i = 0; i < _clients.length; i += 1) {
	    if (_clients[i].getId() == clientId) {
		_clients[i].placeShips(ships);
		break;
	    }
	}
    };

    var fireShot = function(clientId, location) {
	var i;
	for (i = 0; i < _clients.length; i += 1) {
	    // Find the other client
	    if (_clients[i].getId() != clientId) {
		_clients[i].checkForHit(location);
		break;
	    }
	}
    };

    return {
	getName: getName,
	placeShips: placeShips,
	fireShot: fireShot
    };
};

exports.Room = Room;
