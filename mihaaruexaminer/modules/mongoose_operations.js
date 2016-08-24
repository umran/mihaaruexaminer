var mongoose = require('mongoose')
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
	
	UrlHash.findOne(hash, function(err, res){
		
		if(err) {
			callback(err)
			return
		}
		
		if(res) {
			var response = {}
			response.code = 0
			response.message = "RECORD EXISTS"
			
			callback(null, response)
			return
		}
		
		// prepare to write url to disk
		var record = new UrlHash({ urlHash: hash })
		
		// attempt to write url to disk
		record.save(function(err){
			if(err) {
				if(err.code === 11000) {					
					var response = {}
					response.code = 0
					response.message = "RECORD EXISTS"
					
					callback(null, response)
					return
				}
				
				callback(err)
				return
			}
			
			var response = {}
			response.code = 1
			response.message = "RECORD SAVED TO DISK"
			
			callback(null, response)
			
		})
	
	})
}

MongooseOps.prototype.saveDoc = function(document, callback) {
	var urlHash = document.header.urlHash
	var doc = new Doc({urlHash: urlHash, doc: document})
}

module.exports = MongooseOps