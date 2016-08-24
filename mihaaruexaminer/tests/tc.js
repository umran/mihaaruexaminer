var Classy = require("./classy")
var q = []
var classy = new Classy(q)

q.push('apple')
q.push('banana')

console.log(q)
console.log('\n')

classy.mutate()
console.log(q)