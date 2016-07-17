var async = require('async')
var Getter = require('./getter')
var Extractor = require('./extractor')
var RedisQueue = require('./redis_queue')

var getter = new Getter()
var extractor = new Extractor()
var redisQueue = new RedisQueue()

function Worker() {
}

Worker.prototype.work = function(resource, callback) {

	getter.get(resource, function(err, res) {
		
		// deal with any errors
		if(err){
			callback(err)
			return
		}
		
		var status
		var ioOps = []
		
		if(res.code === 1) {
			status = 'PENDING'
			
			// prime resource for a second attempt or discard it
			ioOps.push(function(callback){
				redisQueue.markRetryOrDone(JSON.stringify(res.resource), function(err){
					if(err) {
						callback(err)
						return
					}
					callback()
				})
			})
			
			// execute io in parallel
			async.parallel(ioOps, function(err){
				if(err) {
					callback(err)
					return
				}
				
				callback(null, status)
			})
			
			return
		}

		// extract current domain
		var currentDomain = res.resource.domain

		// proceed to initialize response as a dom object
		var $ = extractor.load(res.body)

		// get all links from dom
		var links = extractor.extractLinks($, currentDomain)
		
		// debugging
		console.log('LINKS FOUND: ' + links.length)
		
		links.forEach(function(link){
			//put link in redis queue
			ioOps.push(function(callback){
				redisQueue.markInq(JSON.stringify(link), function(err){
					if(err) {
						callback(err)
						return
					}
					callback()
				})
			})
		})

		// get article if article
		var article = extractor.extractArticle($)
		
		
		if(article === false) {
			status = 'MISS'
		} else {
			status = 'HIT'
			
			// append url information to article
			article.header = res.resource
		}
		
		// mark as done in redis
		
		ioOps.push(function(callback){
			redisQueue.markDone(JSON.stringify(res.resource), function(err){
				if(err) {
					callback(err)
					return
				}
				callback()
			})
		})
		
		// execute io in parallel
		async.parallel(ioOps, function(err){
			if(err) {
				callback(err)
				return
			}
			
			callback(null, status)
		})

	})
}

module.exports = Worker