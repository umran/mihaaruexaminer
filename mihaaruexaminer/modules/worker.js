var async = require('async')
var Getter = require('./getter')
var Extractor = require('./extractor')
var RedisQueue = require('./redis_queue')
var AsyncIO = require('./async_io')

var getter = new Getter()
var extractor = new Extractor()
var redisQueue = new RedisQueue()
var asyncIO = new AsyncIO()

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
			
			// async io
			asyncIO.markRetryOrDone(res.resource)
			
			// async io exec
			asyncIO.execute(function(err, res){
				if(err) {
					callback(err)
					return
				}
				
				callback(null, status)
			})
			
			return
		}

		// set current domain
		var currentDomain = res.resource.domain

		// proceed to initialize response as a dom object
		var $ = extractor.load(res.body)

		// get all links from dom
		var links = extractor.extractLinks($, currentDomain)
		
		// debugging
		console.log('LINKS FOUND: ' + links.length)
		
		links.forEach(function(link){
			
			//async io
			asyncIO.markInq(link)
			
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
		
		// async io
		asyncIO.markDone(res.resource)
		
		// async io exec
		asyncIO.execute(function(err, res){
			if(err) {
				callback(err)
				return
			}
			callback(null, status)
		})

	})
}

module.exports = Worker