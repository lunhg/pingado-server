//   -  the server 
const http = require('http');

module.exports = function(app){
    return new Promise(function(resolve, reject){
	let server = http.createServer(app);
	server.listen(app.get('port'), function(){
	    resolve(server);
	});
    });
}
