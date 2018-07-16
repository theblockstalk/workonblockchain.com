const mongoose = require('mongoose');
const ImageSchema = mongoose.Schema({
	imagePath: 
	{
		type:String,
		required:true,
		unique: true
	}
	
	//info : [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileDetail' }]

});
const Image = module.exports = mongoose.model('Image',ImageSchema);




