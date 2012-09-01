var Client = function(clientId) {
    var _id = clientId;
    var _placed = false;
    var _ships = [];
    var _shots = [];

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
	if (_placed) {
	    throw "Cannot move ships once the game has started.";
	}

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

    var checkForHit = function(shooterId, location) {
	var i, j, k;
	var shipIter;

	var shotResult = {
	    location: location,
	    type: "miss",
	    ship: [],
	    shooter: shooterId,
	    target: _id,
	    allSunk: false
	};

	for (i = 0; i < _ships.length; i += 1) {
	    for (j = 0; j < _ships[i].cellsOccupied.length; j += 1) {
		if (_ships[i].cellsOccupied[j][0] === location[0] &&
		    _ships[i].cellsOccupied[j][1] === location[1]) {

		    // Mark the hit first
		    for (k = 0; k < _ships[i].cellsHit.length; k += 1) {
			if (_ships[i].cellsHit[k][0] === location[0] &&
			    _ships[i].cellsHit[k][1] === location[1]) {
			    throw "Shot already fired at " + location;
			}
		    }

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

	if (shotResult.type === "sink") {
	    var sunkCount = 0;
	    // check for win/lose condition
	    for (shipIter = 0; shipIter < _ships.length; shipIter += 1) {
		if (_ships[shipIter].cellsHit.length ==
		    _ships[shipIter].cellsOccupied.length) {
		    sunkCount += 1;
		}
	    }

	    if (_ships.length === sunkCount) {
		shotResult.allSunk = true;
	    }
	}

	return shotResult;
    };

    var fireShot = function(location) {
	var i;

	for (i = 0; i < _shots.length; i += 1) {
	    if (_shots[i][0] === location[0] &&
		_shots[i][1] === location[1]) {
		throw "Tried to fire a shot at " + location + " twice.";
	    }
	}

	_shots.push(location);
    };

    var isClientReady = function() {
	return _placed;
    };

    return {
	getId: getId,
	placeShips: placeShips,
	checkForHit: checkForHit,
	fireShot: fireShot,
	isClientReady: isClientReady
    };
};

var Room = function(id) {
    var _id = id;
    var _clients = [];

    var getId = function() {
	return _id;
    };

    var addClient = function(clientId) {
	if (_clients.length >= 2) {
	    throw "This room is full";
	}

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

	if (i === _clients.length) {
	    throw "Invalid clientId";
	}
    };

    var fireShot = function(clientId, location) {
	var i;
	var shooterId;

	// validate clientId
	for (i = 0; i < _clients.length; i += 1) {
	    if (_clients[i].getId() === clientId) {
		_clients[i].fireShot(location);
		shooterId = _clients[i].getId();
		break;
	    }
	}

	if (i === _clients.length)
	    throw "Invalid clientId";

	for (i = 0; i < _clients.length; i += 1) {
	    // Find the other client
	    if (_clients[i].getId() != clientId) {
		return _clients[i].checkForHit(shooterId, location);
	    }
	}

	throw "Client " + clientId + " not found";
    };

    var areClientsReady = function() {
	var i;
	var readyCount;

	for (i = 0; i < _clients.length; i += 1) {
	    if (_clients[i].isClientReady()) {
		readyCount += 1;
	    }
	}

	return (readyCount === _clients.length);
    };

    var getClientIds = function() {
	var clientIds = [];
	var i;

	for (i = 0; i < _clients.length; i += 1) {
	    clientIds.push(_clients[i].getId());
	}

	return clientIds;
    };

    return {
	getId: getId,
	placeShips: placeShips,
	fireShot: fireShot,
	addClient: addClient,
	areClientsReady: areClientsReady,
	getClientIds: getClientIds
    };
};

exports.Room = Room;
