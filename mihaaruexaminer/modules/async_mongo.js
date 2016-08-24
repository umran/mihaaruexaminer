var async = require('async')
var MongooseOps = require('./mongoose_operations')

// Initialize modules
var mongooseOps = new MongooseOps()

AsyncMongo = function(asyncRedis) {
	this._tasks = []
	this._asyncRedis = asyncRedis
}

AsyncMongo.prototype.saveUrl = function(url) {
	this._tasks.push(function(callback){
		mongooseOps.saveUrl(url, function(err, res) {				
			if(err) {
				callback(err)
				return
			}
			
			if(res.code === 0) {
				callback()
				return
			}
			
			this._asyncRedis.markInq(url)
			callback()
		})
	})
}

AsyncMongo.prototype.execute = function(callback) {
	async.parallel(this._tasks, function(err){
		if(err) {
			callback(err)
			return
		}
		
		callback()
	})
}

module.exports = AsyncMongo