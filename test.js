var async = require('async')
var Getter = require('./lib/getter')
var Extractor = require('./lib/extractor')

var getter = new Getter()

var resource = { url: 'http://mihaaru.com/', domain: 'mihaaru.com', path: '/' }

getter.get(resource, function(err, res) {
	
	// deal with any errors
	if(err){
		console.log(err)
		return
	}

	// create new extractor instance
	var extractor = new Extractor()

	// extract current domain
	var currentDomain = res.resource.domain

	// proceed to initialize response as a dom object
	var $ = extractor.load(res.body)

	// get all links from dom
	var links = extractor.extractLinks($, currentDomain)
	
	for(var i = 0, len = links.length; i < len; i++) {
		console.log(links[i])
	}

	// get article if article
	var article = extractor.extractArticle($)

	if(article === false) {
		console.log('The requested page is not an article')
		return
	}

	console.log(article.body.main)
	
})
