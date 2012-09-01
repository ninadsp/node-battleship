exports.index = function(req, res){
	console.log('Request received');
	res.sendfile(__dirname + '/../public/index.html');
};

