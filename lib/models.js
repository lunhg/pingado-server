const foreach = require('foreach');
const mongoose = require('mongoose');

module.exports = function(models, schemas){
    foreach(schemas, function(v, k, o){
	models.push(new Promise(function(resolve, reject){
	    try{
		let schema = mongoose.Schema(v);
		resolve(mongoose.model(k, schema))
	    }
	    catch(e){
		reject(e)
	    }   
	}))
    });
}
