var mongoose     = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
	username: String,
	password: String
},{
	timestamps: true
});

userSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword) {
	var user = this;
	return new Promise(function(resolve, reject) {
		bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
			if (err) return reject(err);
			resolve(isMatch);
		});
	});
};

module.exports = mongoose.model('User', userSchema);