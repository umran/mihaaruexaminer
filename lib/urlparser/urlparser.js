function UrlParser() {
}

UrlParser.prototype.parse = function(url) {
	return url.match(/^(?:https?:\/\/)?((?:[A-Za-z0-9]+(?:-+[A-Za-z0-9]+)*\.)*mihaaru\.com(?::[0-9]+)?)((?:\/[A-Za-z0-9!$&'()*+,;=\-._~:?#[\]@%]*)*)|^((?:\/[A-Za-z0-9!$&'()*+,;=\-._~:?#[\]@%]*)+)/)
}

module.exports = UrlParser