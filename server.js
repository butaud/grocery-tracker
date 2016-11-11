// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var cookieParser = require('cookie-parser');
var Store = require('./app/models/store.js'),
	User = require('./app/models/user.js'),
	Receipt = require('./app/models/receipt.js'),
	Product = require('./app/models/product.js'),
	Purchase = require('./app/models/purchase.js'),
	Unit = require('./app/models/unit.js');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(cookieParser());

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/bears')
	.post(function(req, res) {
		var bear = new Bear();
		bear.name = req.body.name;

		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});
	})
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});

router.route('/bears/:bear_id')
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);

			bear.name = req.body.name;

			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({message: 'Bear updated!'});
			});
		});
	})
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({message: "Successfully deleted!"});
		});
	});

router.route('/login')
	.post(function(req, res) {
		var username = req.body.username;
		User.findOne({username: username}).exec().then(function(user) {
			return user.comparePassword(req.body.password);
		}).then(function(matches) {
			if (matches) {
				res.cookie('Username', username, {maxAge: 900000, httpOnly: true});
				res.status(200).send("You're good to go!");
			} else {
				res.status(403).send("Invalid username or password");
			}
		}).catch(function(err) {
			console.error(err);
			res.status(403).send("Invalid username or password");
		});
	});

router.route('/products')
	.get(function(req, res) {
		if (!req.cookies.Username) {
			return res.status(403).send("Authentication required");
		}

		User.findOne({username: req.cookies.Username}).exec().then(function(user) {
			var query = Product.find({
				// Products with no user belong to everyone
				$or: [{user: user._id},{user: null}]
			})
			if (req.query.category) {
				query.and({category: req.query.category});
			}
			return query.exec();
		}).then(function(products) {
			res.json(products);
		}).catch(function(err) {
			res.status(500).send(err);
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);