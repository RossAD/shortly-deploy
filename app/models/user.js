var db = require('../config');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema ({
  url: String,
  username: String,
  password: String,
  createdAt: Date
});

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
  
// });
var User = mongoose.model('User', userSchema);

module.exports = User;
