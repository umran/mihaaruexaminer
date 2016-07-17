var request = require('request')

function Getter() {
}

Getter.prototype.get = function(resource, callback) {
	request(resource.url, function(err, res, body) {
		
		// Create response object
		var response = {
			resource: resource
		}
		
		// Handle possible errors
		if(err) {
			callback(err)
			return
		}
		
		if(res.statusCode != 200) {
			response.code = 1
		} else {
			response.code = 0
			response.body = body
		}
		
		// Callback with response from server
		callback(null, response)
	})
}

module.exports = Getter