const should = require('should');
const path = require('path');
const Pingado = require('../index')
const foreach = require('foreach');
const fs = require('fs');
let mongoose = require('mongoose');

let env = path.join(__dirname, '.env')
let envs = 'PORT DATABASE LOGGER VIEWS ENGINE PUBLIC IMAGES STYLES SCRIPTS COVERAGE DOCUMENTATION'

Pingado.init(env).then(function(){
    describe('Testing pingado', function(){

	let suite = {};

	it('should .env file exist', function(done){
	    fs.readFile(env, 'utf8', function(err, data){
		if(!err) done()
		if(err) done(err)
	    });
	})

	it('should export .env environment', function(done){    
	    foreach(envs.split(' '), function(e,i,o){
		process.env.should.have.property('PINGADO_'+e)
	    })
	    done()
	});

	it('should start mongodb', function(){    
	    pingado = Pingado.database('mongodb').then(function(conn){
		suite.connection = conn;
		conn._readyState.should.equal(1)
	    })
	    return pingado;
	});

	it('should initialize logger', function(){    
	    pingado = pingado.then(Pingado.logger).then(function(logger){
		logger.warn('Log Test')
		suite.logger = logger;
		return logger
	    })
	    return pingado;
	});

	it('should configure app', function(){    
	    pingado = pingado.then(Pingado.app).then(function(app){
		mongoose.model('Cookie', mongoose.Schema({
		    value: String,
		    path: String
		}))
		mongoose.model('Token', mongoose.Schema({
		    value: String
		}))
		mongoose.model('Test', mongoose.Schema({
		    cookie: {type: mongoose.Schema.Types.ObjectId, ref: 'Cookie'},
		    token: {type: mongoose.Schema.Types.ObjectId, ref: 'Token'}
		}))
		let Test = mongoose.model('Test');
		let Cookie = mongoose.model('Cookie');
		let Token = mongoose.model('Token');
		app.get('/', function(req, res){
		    res.json({
			_csrf:req.csrfToken()
		    });
		})
		app.post('/', function(req, res){
		    let c = req.headers['cookie'].split(";")
		    let cookie = new Cookie({
			value:c[0].split(";")[0].split("_csrf=")[1],
			path:c[1].split("=")[1]
		    })
		    let token = new Token({
			value:req.body._csrf
		    })
		    cookie.save()
		    token.save()
		    let test = new Test({cookie:cookie, token:token})
		    test.save(function(err, t){
			if(err) res.json({message:err.message,code:err.code,stack:err.stack.split("\n")})
			suite.logger.warn('Added '+t._id+' Test')
			res.json(t)
		    });
		})
		suite.app = app;
		return app
	    })
	    return pingado;
	});

	it('should serve', function(){    
	    pingado = pingado.then(Pingado.serve).then(function(server){
		suite.server = server
		let addr = server.address();
		suite.logger.warn('Running '+addr.family+' server on '+addr.address+addr.port)
		suite.agent = require('supertest').agent('http://localhost:3000');
		return server
	    })
	    return pingado;
	});

	it('should GET /', function(done){    
	    suite.agent.get('/')
		.expect(200)
		.expect('Content-Type', /json/)
		.expect(function(res){
		    res.body.should.have.property('_csrf')
		    res.body._csrf.should.match(/[a-zA-Z0-9\-\_]+/);
		    suite.token = res.body._csrf
		    suite.cookie = res.headers['set-cookie']
		    
		}).end(done)
	});

	it('should POST /', function(){    
	    return new Promise(function(resolve, reject){
		suite.agent.post('/')
		    .set('cookie', suite.cookie)
		    .send({_csrf:suite.token})
		    .expect(200)
		    .expect('Content-Type', /json/)
		    .expect(function(res){
			res.body.should.have.property('_id');
			res.body.should.have.property('cookie');
			res.body.should.have.property('token');
			res.body._id.should.match(/[a-z0-9]+/)
			res.body.cookie._id.should.match(/[a-z0-9]+/)
			res.body.token._id.should.match(/[a-z0-9]+/)
			res.body.cookie.value.should.match(/[a-z0-9A-Z\-\_]+/)
			res.body.token.value.should.match(/[a-z0-9A-Z\-\_]+/)
			res.body.token.value.length.should.be.above(res.body.cookie.value.length)
		    }).then(resolve).catch(reject)
		})
	    });

	after(function(){
	    suite.server.close(function(){
		suite.logger.warn('End of test')
		suite.connection.close()
	    })
	});
	
	run();
    })
    
})

