var mongoose = require('mongoose'),
	Store = require('./app/models/store.js'),
	User = require('./app/models/user.js'),
	Receipt = require('./app/models/receipt.js'),
	Product = require('./app/models/product.js'),
	Purchase = require('./app/models/purchase.js'),
	Unit = require('./app/models/unit.js');

mongoose.connect('mongodb://localhost:27017');
mongoose.Promise = global.Promise;

var promises = [Store, User, Receipt, Product, Purchase, Unit].map(function(model) {
	return model.remove({}).exec();
});

Promise.all(promises).then(function(){
	var safeway = new Store({
		name: "Safeway"
	});

	var qfc = new Store({
		name: "QFC"
	});

	var u1 = new User({
		username: "butaud",
		password: "foo"
	});

	var u2 = new User({
		username: "butaud2",
		password: "bar"
	});

	var oz = new Unit({
		name: "Ounces",
		unitType: "WEIGHT"
	});

	var lb = new Unit({
		name: "Pounds",
		unitType: "WEIGHT",
		baseUnit: oz,
		baseUnitFactor: 16
	});

	var quart = new Unit({
		name: "Quarts",
		unitType: "VOLUME"
	});

	var gallon = new Unit({
		name: "Gallons",
		unitType: "VOLUME",
		baseUnit: quart,
		baseUnitFactor: 4
	});

	return Promise.all([safeway.save(), qfc.save(), u1.save(), oz.save(), lb.save(), quart.save(), gallon.save(), u2.save()]);
}).then(function(results) {
	var safeway = results[0];
	var u1 = results[2];
	var u2 = results[7];
	var r1 = new Receipt({
			store: safeway,
			user: u1,
			date: new Date()
	});
	var gal = results[6];
	var lb = results[4];
	var milk = new Product({
		name: "Milk",
		category: "Dairy",
		defaultUnit: gal
	});
	var flour = new Product({
		name: "Flour",
		category: "Baking",
		defaultUnit: lb
	});
	var wFlour = new Product({
		name: "Whole Wheat Flour",
		category: "Baking",
		defaultUnit: lb,
		user: u2
	});
	return Promise.all([r1.save(), milk.save(), flour.save(), gal, lb, wFlour.save()]);
}).then(function(results) {
	var [receipt, milk, flour, gal, lb] = results;
	var p1 = new Purchase({
		receipt: receipt,
		product: milk,
		unit: gal,
		unitCount: 1,
		unitPrice: 3.59
	});

	var p2 = new Purchase({
		receipt: receipt,
		product: flour,
		unit: lb,
		unitCount: 5,
		unitPrice: 1.5
	});
	return Promise.all([p1.save(), p2.save()]);
}).then(function() {
	return Purchase.find()
		.populate({
			path: 'receipt',
			populate: {path: 'store user'}
		})
		.populate('product')
		.populate('unit', 'name')
		.exec();
}).then(function(purchases) {
	purchases.forEach(function(purchase){
		console.log(purchase.receipt.user.username + " purchased " + purchase.unitCount + " " + purchase.unit.name + " of " + purchase.product.name + " at " + purchase.receipt.store.name + " on " + purchase.receipt.date);
	});
}).then(function() {
	console.log("Done!");
	mongoose.connection.close();
}).catch(function(err) {
	console.error(err);
});