var Room = require("./Room");

roomCounter = 0;
var roomList = []; // Array containing all the roomIDs

var createRoom = function()
{
	var roomId = "r2d2" + (roomCounter++);
	var room = Room(roomId);
	roomList.push(room);
	return roomId;
}

var joinRoom = function(roomId, clientId)
{
	var room = null;
	//var ret ;
	for(var i = 0; i<roomList.length; i++)
	{
		if(roomList[i].getId() == roomID)
		{
			room = roomList[i];
			try
			{
				room.addClient(clientId);
			}
			catch(e)
			{
				throw e;
			}
			break;
		}
	}

	if(room == null)
	{
		throw "Sorry, I can't find this room on my Marauder's map !!! ";
	}
}

var placeShips = function(roomID, clientId, ships)
{
	var room = null;
	//var ret ;
	for(var i = 0; i<roomList.length; i++)
	{
		if(roomList[i].getId() == roomID)
		{
			room = roomList[i];
			try
			{
				room.placeShips(clientId, ships);
			}
			catch(e)
			{
				throw e;
			}
			break;
		}
	}

	if(room == null)
	{
		throw "Sorry, I can't find this room on my Marauder's map !!! ";
	}
	
}

var fireShot = function(roomID, clientId, location)
{
	var room = null;
	var ret ;
	for(var i = 0; i<roomList.length; i++)
	{
		if(roomList[i].getId == roomID)
		{
			room = roomList[i];
			try
			{
				ret = room.fireShot(clientId, location); // returns JSON object {type: , location: , ship: }
				return ret;
			}
			catch(e)
			{
				throw e;
			}
			break;
		}
	}
		
	if(room == null)
	{
		throw "Sorry, I can't find this room on my Marauder's map !!! ";
	}
}

exports.createRoom = createRoom;
exports.joinRoom = joinRoom;
exports.addClient = addClient;
exports.fireShot = fireShot;







