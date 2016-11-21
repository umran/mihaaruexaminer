function matchDv($) {
	// set language to dhivehi
	var language = 'dhivehi'
	
	// extract author
	var author = $('.article-details .by-line address').text()
	
	// extract date string
	var date = $('.article-details .by-line .date-time').text()
	
	// extract title
	var title = $('.article-details h1').text()
	
	// extract tags -- haveeru doesn't seem to support tags on their dhivehi site.
	// this is just here for the sake of completeness and because results need
	// to be normalized across domains
	var tags = []
	
	// collate meta data
	var meta = {
		language: language,
		title: title,
		author: author,
		date: date,
		tags: tags
	}
	
	// extract body elements
	var body = {}
	body.main = []
	body.miscellaneous = []
	$('.article-details article').children().each(function(i, elem){
		
		// skip if image or ad
		if($(elem).is('figure') || $(elem).is('.live-posts')) {
			body.miscellaneous.push($(elem).text())
			return
		}
		body.main.push($(elem).text())
	})
	
	var response = {
		meta: meta,
		body: body
	}
	
	return response
}

function matchEn($) {
	// set language to english
	var language = 'english'
	
	// extract author
	var author = $('#main-content article .entry-meta-author a').text()
	
	// extract date string
	var date = $('#main-content article .entry-meta-date').text()
	
	// extract title
	var title = $('#main-content article header .entry-title').text()
	
	// extract tags
	var tags = []
	$('#main-content article .entry-tags').children().each(function(i, elem){
		if($(elem).is('a')) {
			tags.push($(elem).text())
		}
	})
	
	// collate meta data
	var meta = {
		language: language,
		title: title,
		author: author,
		date: date,
		tags: tags
	}

	// extract body elements
	var body = {}
	body.main = []
	body.miscellaneous = []
	$('#main-content article .entry-content').children().each(function(i, elem){
		
		// skip if image or ad
		if($(elem).is('.insert-post-ads') || $(elem).is('.wp-caption')) {
			body.miscellaneous.push($(elem).text())
			return
		}
		
		body.main.push($(elem).text())
	})
	
	var response = {
		meta: meta,
		body: body
	}
	
	return response
}

exports.matchEn = matchEn
exports.matchDv = matchDv