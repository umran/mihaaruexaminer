function UrlParser() {
}

UrlParser.prototype.parse = function(url) {
	url = this.standardize(url)
	return url.match(/^(?:https?:\/\/)?((?:[A-Za-z0-9]+(?:-+[A-Za-z0-9]+)*\.)*mihaaru\.com(?::[0-9]+)?)((?:\/[A-Za-z0-9!$&'()*+,;=\-._~:?#[\]@%]*)*)|^((?:\/[A-Za-z0-9!$&'()*+,;=\-._~:?#[\]@%]*)+)/)
}

UrlParser.prototype.standardize = function(url) {
	if(url.slice(-1) === '/') {
		return url
	} else {
		url += '/'
		return url
	}
		
}

module.exports = UrlParser