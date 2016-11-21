var async = require('async')
var MongooseOps = require('./mongoose_operations')
var AsyncRedis = require('./async_redis')

// Initialize modules
var mongooseOps = new MongooseOps()

AsyncMongo = function(asyncRedis) {
	this._tasks = []
	this._asyncRedis = new AsyncRedis()
}

AsyncMongo.prototype.markRetryOrDone = function(resource) {
	var self = this
	self._asyncRedis.markRetryOrDone(resource)
}

AsyncMongo.prototype.saveUrl = function(url) {
	var self = this
	self._tasks.push(function(callback){
		mongooseOps.saveUrl(url, function(err, res) {				
			if(err) {
				callback(err)
				return
			}
			
			if(res.code === 0) {
				callback()
				return
			}
			
			self._asyncRedis.markInq(url)
			callback()
		})
	})
}

AsyncMongo.prototype.saveDoc = function(doc) {
	var self = this
	self._tasks.push(function(callback) {
		mongooseOps.saveDoc(doc, function(err, res) {
			if(err) {
				callback(err)
				return
			}
			
			if(res.code === 0) {
				callback()
				return
			}
			
			self._asyncRedis.markDone(doc.header.url)
			callback()
			
		})
	})
}

AsyncMongo.prototype.execute = function(callback) {
	var self = this
	async.parallel(self._tasks, function(err){
		if(err) {
			callback(err)
			return
		}
		
		self._asyncRedis.execute(function(err, res){
			if(err) {
				callback(err)
				return
			}
			
			callback()
		})
	})
}

module.exports = AsyncMongo