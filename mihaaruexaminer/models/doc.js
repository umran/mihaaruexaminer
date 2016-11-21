var mongoose = require('../lib/mongoose_client')
var mongoosastic = require('mongoosastic')

var url = new mongoose.Schema({
	url: {type: String, es_indexed: true},
	domain: {type: String, es_indexed: true},
	path: {type: String, es_indexed: true}
})

var header = new mongoose.Schema({
	urlHash: {type: String, unique: true, es_indexed: true, es_index:'not_analyzed'},
	url: {type: url}
})

var meta = new mongoose.Schema({
	language: {type: String, es_indexed: true},
	title: {type: String, es_indexed: true, es_analyzer:'english'},
	author: {type: String, es_indexed: true},
	date: {type: String, es_indexed: true},
	tags: {type: [String]}
})

var body = new mongoose.Schema({
	main: {type: Object, es_indexed: false},
	miscellaneous: {type: Object, es_indexed: false},
	main_fulltext: {type: String, es_indexed: true, es_analyzer:'english'}
})

var docSchema = new mongoose.Schema({
	header: {type: header},
	meta: {type: meta},
	body: {type: body}
})

docSchema.plugin(mongoosastic, {
	hosts: ['localhost:9200']
})

var Doc = mongoose.model('Doc', docSchema)

module.exports = Doc