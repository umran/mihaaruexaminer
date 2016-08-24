var config = require('../config.js');
var mongoose = require('mongoose');

var docSchema = new mongoose.Schema({
  urlHash: {type: String, unique: true, required: true},
  doc: {type: Object, unique: false, required: true}
});

docSchema.plugin(mongoosastic, config.elasticServer);

var Doc = mongoose.model('Doc', docSchema);

module.exports = Doc;