var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var purchaseSchema = new Schema({
	receipt: {type: Schema.Types.ObjectId, ref: 'Receipt'},
	product: {type: Schema.Types.ObjectId, ref: 'Product'},
	unit: {type: Schema.Types.ObjectId, ref: 'Unit'},
	unitCount: Number,
	unitPrice: Number,
	notes: String
});

module.exports = mongoose.model('Purchase', purchaseSchema);