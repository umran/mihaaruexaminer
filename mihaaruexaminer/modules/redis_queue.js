var client = require('../lib/redis_client')

function RedisQueue() {
}

RedisQueue.prototype.markInq = function(url, callback) {
	url = JSON.stringify(url)
	
	client.get(url, function(err, res){
		if(err) {
			callback(err)
			return
		}

		if(res !== null) {
			callback()
			return		
		}
		
		client.set(url, 'inq', function(err){
			if(err){
				callback(err)
				return
			}
			callback()
		})
	})
}

RedisQueue.prototype.markRetryOrDone = function(url, callback) {
	url = JSON.stringify(url)
	
	client.get(url, function(err, res){
		if(err) {
			callback(err)
			return
		}

		if(res === 'retry') {
			client.set(url, 'done', function(err){
				if(err){
					callback(err)
					return
				}
				callback()
			})
		} else {
			client.set(url, 'retry', function(err){
				if(err){
					callback(err)
					return
				}
				callback()
			})
		}
	})
}

RedisQueue.prototype.markDone = function(url, callback) {
	
	url = JSON.stringify(url)
	
	client.set(url, 'done', function(err){
		if(err){
			callback(err)
			return
		}
		callback()
	})
}

module.exports = RedisQueue