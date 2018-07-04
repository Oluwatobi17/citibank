var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/citibank');

var UserSchema = mongoose.Schema({
	userId: {
		type: String
	},
	name: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	password : {
		type: String,
		required: true,
		bcrypt: true
	},
	accountBal: {
		type: Number
	}
});


var User = module.exports = mongoose.model('users',UserSchema, 'users');

/* Compare the password given by user while trying to log in */
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

/* Get user id while trying to login */
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

/* check if a user exit during login*/
module.exports.checkUserByUserId = function(userId, callback){
	var query= {userId: userId};
	User.findOne(query, callback);
}

/* create user with a registration form */
module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;

		newUser.password = hash;
		newUser.save(callback);
	});
	
}