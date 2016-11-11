var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var productSchema = new Schema({
	name: String,
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	category: String,
	defaultUnit: {type: Schema.Types.ObjectId, ref: 'Unit'}
});

module.exports = mongoose.model('Product', productSchema);