var async = require('async')
var client = require('../lib/redis_client')

function Scanner() {
}

Scanner.prototype.fetchNext = function(callback) {
	var calls = []
	var results = []

	client.scan(0, nextBatch)

	function nextBatch(err,res){
		if(err){
			callback(err)
			return
		}
		var cursor = res[0]
		var batch = res[1]
		
		// debugging
		console.log('BATCH: ' + batch.length)
		
		//put redis operations in a parallel queue
		batch.forEach(function(url){
			calls.push(function(callback){
				client.get(url, function(err,res){
					if(err){
						callback(null, 'unexpected redis error occurred');
						return
					}
					if(res === 'inq' || res === 'retry'){
						
						// convert string into object
						var urlObj = JSON.parse(url)
						
						results.push(urlObj)
						callback()
						return
					}
					client.del(url, function(err,res){
						if(err){
							callback(err)
							return
						}
						callback()						
					})
				})
			})
		})

		if(cursor === '0'){
			async.parallel(calls, function(err, res) {
				if(err){
					callback(err)
					return
				}
				
				// debugging
				console.log('BATCHES COLLATED AS RESULTS: ' + results.length)
				
				callback(null, results)
			})
			return
		}
		client.scan(cursor,nextBatch)
	}
}

module.exports = Scanner

