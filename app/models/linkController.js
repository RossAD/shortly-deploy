// Link methods

var crypto = require('crypto');
var Link = require('link.js');



// exports.initialize = function() {
// // Change methods to mongodb methods
//   this.pre('save', function(model, attrs, options) {
//     console.log("in init link controller ",attrs);
//     var shasum = crypto.createHash('sha1');
//     model.update('code', shasum.digest('hex').slice(0, 5));
//   });
// };

Link.pre('save', function(next) {
  console.log("in pre save");
  var shasum = crypto.createHash('sha1');
  this.update('code', shasum.digest('hex').slice(0, 5));
  next();
});