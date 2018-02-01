const mongoose = require('mongoose');

module.exports = function(callback){
    mongoose.connect(process.env.PINGADO_DATABASE, function(err){
	if(err) callback(err)
    });
    mongoose.connection.on('open', function(){
	console.log('Mongodb connected');
    })
    mongoose.connection.on('connected', function(){
	callback(null, mongoose.connection)
    });

    mongoose.connection.on('close', function(){
	console.log('Mongodb disconnected.');
	process.exit();
    })
};

