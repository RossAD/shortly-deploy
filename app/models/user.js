// var db = require('../config');
var Promise = require('bluebird');
var db = require('../config');
var mongoose = require('mongoose');

// var userSchema = new mongoose.Schema ({
//   url: String,
//   username: String,
//   password: String,
//   createdAt: Date
// });

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
  
// });

// userSchema.methods.hashPassword = ...
// 'this' is the current document

// call same way as bookshelf user.hashPassword( password )
var User = mongoose.model('User', db.userSchema);

module.exports = User;
