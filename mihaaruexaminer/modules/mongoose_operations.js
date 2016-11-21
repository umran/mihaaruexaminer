var mongoose = require('../lib/mongoose_client')
var CryptoOps = require('./crypto_operations')

// Instantiate Modules
var cryptoOps = new CryptoOps()

// Include Models
var Doc = require('../models/doc')
var UrlHash = require('../models/url_hash')

function MongooseOps() {
}

MongooseOps.prototype.saveUrl = function(url, callback) {
	
	url = JSON.stringify(url)
	var hash = cryptoOps.sha256(url)
		
	// prepare to write url to disk
	var record = new UrlHash({ urlHash: hash })
	
	// attempt to write url to disk
	record.save(function(err){
		if(err) {
			if(err.code === 11000) {					
				var response = {}
				response.code = 0
				response.message = "URL EXISTS"
				
				callback(null, response)
				return
			}
			
			callback(err)
			return
		}
		
		var response = {}
		response.code = 1
		response.message = "URL SAVED TO DISK"
		
		callback(null, response)
		
	})
}

MongooseOps.prototype.saveDoc = function(document, callback) {
	var doc = new Doc(document)
	
	doc.save(function(err) {
		if(err) {
			if(err.code === 11000) {					
				var response = {}
				response.code = 0
				response.message = "DOC EXISTS"
					
				callback(null, response)
				return
			}
				
			callback(err)
			return
		}
		
		var response = {}
		response.code = 1
		response.message = "DOC SAVED TO DISK"
			
		callback(null, response)	
	})
}

module.exports = MongooseOps