var async = require('async')
var Worker = require('../modules/worker')
var Scanner = require('../modules/scanner')

var worker = new Worker()
var scanner = new Scanner()

var seeds = [{ url: 'http://www.mihaaru.com', domain: 'www.mihaaru.com', path: '/' }, { url: 'http://en.mihaaru.com', domain: 'en.mihaaru.com', path: '/' }]

var q = async.queue(function(task, callback){
	worker.work(task, function(err, res) {
		if(err) {
			callback(err)
			return
		}
		callback(null, res)
	})
}, 5)

q.drain = function(){
	scanner.fetchNext(function(err, res){
		if(err) {
			console.log(err)
			return
		}

		// debugging
		console.log('NEW TASKS: ' + res.length)

		q.push(res, function(err, res){
			if(err) {
				console.log(err)
				return
			}
			console.log(res)
		})

		// debugging
		console.log('NEW TASKS QUEUED: ' + q.length())
	})
}

q.push(seeds, function(err, res){
	if(err) {
		console.log(err)
		return
	}
	console.log(res)
})
