var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var requestSchema = new Schema({
	departure: { 
		type: String, 
		lowercase: true, 
		trim: true 
	},
	destination:  { 
		type: String, 
		lowercase: true, 
		trim: true 
	},	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	startTime:{
		type: Date
	},
	endTime:{
		type: Date
	},
	passenger: {
		type: Number		
	},
	note:{
		type: String
	},
	created: {
	    type: Date,
	    default: Date.now
  	},
  	driverList:[{
		userid:{
			type: Schema.ObjectId,
			ref: 'User'
		},
		createdDate: {
			type: Date,
			default: Date.now
		},
		emailProvided:{
			type: Boolean,
			default: false
		},
		phoneProvided:{
			type: Boolean,
			default: false
		},
		wechatProvided:{
			type: Boolean,
			default: false
		}
	}]
});

module.exports = mongoose.model('Request', requestSchema);