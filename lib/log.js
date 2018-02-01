//   - database connection with the logger
const winstonDB = require('winston-mongodb');
//   - the propper logger
const winston = require('winston');


module.exports = function(dbpath){
    let transports = [
	new winston.transports.Console({ json: true, timestamp: true }),
	new winston.transports.MongoDB({
	    db : dbpath,
	    collection: 'Logs'
	})
    ];
    
    // Logger for exceptions
    let exceptionHandlers = [
	new winston.transports.Console({ json: true, timestamp: true }),
	new winston.transports.MongoDB({
	    db : dbpath,
	    collection: 'Exceptions'
	})
    ];
    
    return new winston.Logger({
	transports: transports,
	exceptionHandlers: exceptionHandlers,
	exitOnError:false
    })
}
