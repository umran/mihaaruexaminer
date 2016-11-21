var async = require('async')
var RedisQueue = require('./redis_queue')

// Initialize modules
var redisQueue = new RedisQueue()

AsyncRedis = function() {
	this._tasks = []
}

AsyncRedis.prototype.markInq = function(resource) {
	var self = this
	self._tasks.push(function(callback){
		redisQueue.markInq(resource, function(err){
			if(err) {
				callback(err)
				return
			}
			callback()
		})
	})
}

AsyncRedis.prototype.markDone = function(resource) {
	var self = this
	self._tasks.push(function(callback){
		redisQueue.markDone(resource, function(err){
			if(err) {
				callback(err)
				return
			}
			callback()
		})
	})
}

AsyncRedis.prototype.markRetryOrDone = function(resource) {
	var self = this
	self._tasks.push(function(callback){
		redisQueue.markRetryOrDone(resource, function(err){
			if(err) {
				callback(err)
				return
			}
			callback()
		})
	})
}

AsyncRedis.prototype.execute = function(callback) {
	var self = this
	async.parallel(self._tasks, function(err){
		if(err) {
			callback(err)
			return
		}
		
		callback()
	})
}

module.exports = AsyncRedis