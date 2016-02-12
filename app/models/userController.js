  var bcrypt = require('bcrypt-nodejs');

 
  exports.initialize = function() {
    this.on('creating', this.hashPassword);
  };

  exports.comparePassword = function(attemptedPassword, callback) {
    // Refactor mongoDB
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  };

  exports.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  };