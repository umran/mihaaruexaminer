function Classy(q) {
	this._q = q
}

Classy.prototype.mutate = function() {
	this._q.push('pear')
	console.log("queue mutated \n")
}

module.exports = Classy