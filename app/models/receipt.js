var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var receiptSchema = new Schema({
	store: {type: Schema.Types.ObjectId, ref: 'Store'},
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	date: Date
});

module.exports = mongoose.model('Receipt', receiptSchema);