// Bring Mongoose into the app 
var mongoose = require('mongoose')

// Build the connection string 
var dbURI = 'mongodb://localhost/newspeak'

// Create the database connection 
mongoose.Promise = global.Promise
mongoose.connect(dbURI)

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
})

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}) 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
})

module.exports = mongoose
