var async = require('async')
var RedisQueue = require('./redis_queue')

var redisQueue = new RedisQueue()

AsyncIO = function() {
	this._tasks = []
}

AsyncIO.prototype.markInq = function(resource) {
	this._tasks.push(function(callback){
		redisQueue.markInq(JSON.stringify(resource), function(err){
			if(err) {
				callback(err)
				return
			}
			callback()
		})
	})
}

AsyncIO.prototype.markDone = function(resource) {
	this._tasks.push(function(callback){
		redisQueue.markDone(JSON.stringify(resource), function(err){
			if(err) {
				callback(err)
				return
			}
			callback()
		})
	})
}

AsyncIO.prototype.markRetryOrDone = function(resource) {
	this._tasks.push(function(callback){
		redisQueue.markRetryOrDone(JSON.stringify(resource), function(err){
			if(err) {
				callback(err)
				return
			}
			callback()
		})
	})
}

AsyncIO.prototype.execute = function(callback) {
	async.parallel(this._tasks, function(err){
		if(err) {
			callback(err)
			return
		}
		
		callback()
	})
}