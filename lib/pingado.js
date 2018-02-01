"use strict";
// # Native libraries
// path, fs, http
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const foreach = require('foreach');

global.Promise = require('bluebird');

Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
})

// The Application Framework
const Pingado = { 

    ENVS:'PORT DATABASE LOGGER VIEWS ENGINE PUBLIC IMAGES STYLES SCRIPTS COVERAGE DOCUMENTATION'.split(' '),

    // Initialize configuration with an environment approach
    init: function(__path__){
	//   - the configuration file
	return new Promise(function(resolve){
	    fs.readFile(__path__, 'utf8', function(err, data){
		if(err) reject(err)
		let newdata = []
		foreach(data.split("\n"), function(val, line, a){
		    newdata.push(val.replace('%ROOT', process.cwd()))
		});
		let buf = new Buffer(newdata.join('\n'))
		let config = dotenv.parse(buf);
		foreach(config, function(v,k,i){
		    process.env[k] = config[k]
		})
		resolve()
	    })
	})
    },
		
    // Starts a database. Defaults to Mongodb
    database: function(adapter){
	return new Promise(function(resolve, reject){
	    let adapter_path = path.join(__dirname, adapter);
	    require(adapter_path)(function(err, connection){
		if(err) reject(err)
		resolve(connection)
	    })
	})
    },

    logger: function(){
	return new Promise(function(resolve, reject){
	    try{
		let logger_path = path.join(__dirname, 'log');
		resolve(require(logger_path)(process.env.PINGADO_DATABASE));
	    }
	    catch(e){
		reject(e)
	    }
	});
    },
    
    app: function(logger){
	return require('./app')({
	    assets_path: [
		'PUBLIC',
		'IMAGES',
		'FONTS',
		'STYLES',
		'SCRIPTS',
		'COVERAGE',
		'REPORT',
		'DOCUMENTATION'
	    ]
	}, logger.info);
    },


    serve: function(app){
	return require('./server')(app)
    },
    
    shutdown: function(suite){
	return new Promise(function(resolve, reject){
	    let server = suite.server;
	    let connection = suite.connection;
	    let logger = suite.logger;
	    let cb = function(){
		logger.warn('Closing remaining connections');
		connection.close();	
	    }
	    resolve(function(){
		server.close(cb)
		
		// if after 
		setTimeout(function(){
		    logger.error('Error during closing connections. Force shutdown.');
		    process.exit()
		}, 10*1000)
	    })
	})
    }
}

module.exports = Pingado
