var mongoose = require('mongoose');

var urlHashSchema = new mongoose.Schema({
	urlHash: {type: String, unique: true, required: true}
});

var UrlHash = mongoose.model('UrlHash', urlHashSchema);

module.exports = UrlHash;