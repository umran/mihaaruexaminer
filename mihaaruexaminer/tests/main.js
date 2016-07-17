var async = require('async')
var Worker = require('../modules/worker')
var Scanner = require('../modules/scanner')

var worker = new Worker()
var scanner = new Scanner()

var seed = { url: 'http://mihaaru.com/news/3055', domain: 'www.mihaaru.com', path: '/news/3055' }

var q = async.queue(function(task, callback){
	
	worker.work(task, function(err, res) {
		if(err) {
			callback(err)
			return
		}
		callback(res)
	})
}, 1)

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

q.push(seed, function(err, res){
	if(err) {
		console.log(err)
		return
	}
	console.log(res)
})