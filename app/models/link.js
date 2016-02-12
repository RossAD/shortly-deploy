var db = require('../config');
var crypto = require('crypto');


var linkSchema = new mongoose.Schema ({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: Date
});


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
 
// });

var Link = mongoose.model('Link', linkSchema);
module.exports = Link;

