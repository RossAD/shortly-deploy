// Link methods

var crypto = require('crypto');
var Link = require('link.js');



exports.initialize = function() {
// Change methods to mongodb methods
  this.on('creating', function(model, attrs, options) {
    var shasum = crypto.createHash('sha1');
    shasum.update(model.get('url'));
    model.set('code', shasum.digest('hex').slice(0, 5));
  });
};