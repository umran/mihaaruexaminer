var request = require('request')

function Getter() {
}

Getter.prototype.get = function(resource, callback) {
	request(resource.url, function(err, res, body) {
		
		// Handle possible errors
		if(err) {
			callback('Request Error: ' + err)
			return
		}
		
		if(res.statusCode != 200) {
			callback('Response Error: Server Returned Code ' + res.statusCode)
			return
		}
		
		// Prepare response
		var response = {
			body: body,
			resource: resource
		}
		
		// Callback with response body from server
		callback(null, response)
	})
}

module.exports = Getter