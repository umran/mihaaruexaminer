var crypto = require('crypto')

function CryptoOps(){
}

CryptoOps.prototype.sha256 = function(value) {
	var hash = crypto.createHash('sha256')
	hash.update(value)
	
	return hash.digest('hex')
}

Module.exports = CryptoOps