var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var unitSchema = new Schema({
	name: String,
	unitType: {
		type: String,
		enum: ['VOLUME', 'WEIGHT', 'QUANTITY']
	},
	baseUnit: {type: Schema.Types.ObjectId, ref: 'Unit'},
	baseUnitFactor: Number	
});

module.exports = mongoose.model('Unit', unitSchema);