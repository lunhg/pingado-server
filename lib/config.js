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
module.exports = function(){
    return new Promise(function(resolve, reject){
	try{
	    resolve(require('./setup')())
	}
	catch(e){
	    reject(e)
	}
    });
}
