var async = require('async')
var Getter = require('./getter')
var Extractor = require('./extractor')
var AsyncRedis = require('./async_redis')
var AsyncMongo = require('./async_mongo')
var MongooseOps = require('./mongoose_operations')
var CryptoOps = require('./crypto_operations')

// Instantiate modules
var getter = new Getter()
var extractor = new Extractor()
var asyncRedis = new AsyncRedis()
var asyncMongo = new AsyncMongo(asyncRedis)
var cryptoOps = new CryptoOps()
var mongooseOps = new MongooseOps()

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
		
		if(res.code === 1) {
			status = 'PENDING'
			
			// async io
			asyncRedis.markRetryOrDone(res.resource)
			
			// async io exec
			asyncRedis.execute(function(err, res){
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
		
		// only bit i'm not proud of
		links.forEach(function(link){
			
			asyncMongo.saveUrl(link)
			
		})
		// end of bit i'm not proud of

		// get article if article
		var article = extractor.extractArticle($)
		
		
		if(article === false) {
			status = 'MISS'
		} else {
			status = 'HIT'
			
			// append url information to article
			article.header = res.resource
			
			// append url hash to header
			article.header.urlHash = cryptoOps.sha256(JSON.stringify(res.resource))
			
			// save document to mongodb
			asyncMongo.saveDoc(article)
		}
		
		// async io
		asyncRedis.markDone(res.resource)
		
		// async io exec
		asyncRedis.execute(function(err, res){
			if(err) {
				callback(err)
				return
			}
			callback(null, status)
		})

	})
}

module.exports = Worker