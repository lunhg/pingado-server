// # Minimal express application:
//   - express
const express = require('express');
//   - used in the template engine
const jstransformer_marked = require('jstransformer-marked');
//   - template engine
const pug = require('pug');
//   - output server information (this is not the propper logger, but some output to the logger)
const morgan = require('morgan');
//   - database
const mongoose = require('mongoose');
//   - the body parser
const body_parser = require('body-parser');
//   - use html and assets compression
const compression = require('compression');
//   - the asset pipeline like Ruby on Rails
const connect_assets = require('connect-assets');
//   - the cookie parser 
const cookieParser = require('cookie-parser')
//   - the csrf protection
const csrf = require('csurf')

// ## Ruby on Rails Structure 
// Let's create express with the application structured like the
// system proposed in Ruby on Rails. Pay attention the we have two files
// named layout, one for the server side (.pug), and another to client side (.vue).
// Despite the extension, the two files are coded in pug.js format:
//
//   * | root_folder
//     |___ app/
//     |______ views/
//     |____________ layout.pug
//     |____________ layout.vue
//     |____________ index.pug
//     |____________ index.vue
//     |______ assets/	
//     |____________ index.html   -----> code coverage
//     |____________ css/
//     |_______________  index.css ----> pipeline
//     |____________ js/
//     |_______________ index.js  -----> pipeline
//     |____________ images/
//     |____________ fonts/
//     |____________ doc/
//     |______ controllers/
module.exports = function(opt, loggerCallback){
    let app = express();

    // ## Setup
    // set views folder as configured in your .env file
    app.set('views', process.env.PINGADO_VIEWS)
    
    // set template engine as pug
    app.set('view engine', process.env.PINGADO_ENGINE);
    app.set('view options', {
	layout:false,
	filters:[jstransformer_marked]
    });
    
    // set assets path as configured in your .env file

    app.set('assets path', opt.assets_path.map(function(e){
	return process.env['PINGADO_'+e]
    }));

    // set the port
    app.set('port', process.env.PINGADO_PORT);
    
    // ## Middlewares
    // set the output server with winston connection
    app.use(morgan(process.env.PINGADO_LOGGER, {
	stream: {
	    write: function(str){
		loggerCallback(str);
	    }
	}
    }));

    // compress outputs
    app.use(compression());
    
    // parse json and encoded url 
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({ extended: false }));
    
    // cookie
    app.use(cookieParser())

    // csrf
    let csrfProtection = csrf({cookie:true});
    app.use(csrfProtection);

    app.use(connect_assets({paths: app.get('assets path'), bundle:true}));
    return app;
}
