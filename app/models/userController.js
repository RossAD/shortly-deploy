  var bcrypt = require('bcrypt-nodejs');

 
  exports.initialize = function() {
    this.on('creating', this.hashPassword);
  };

  exports.comparePassword = function(attemptedPassword, user, callback) {
    // Refactor mongoDB
    User.FindOne({username: user}, function (err, user) {
      if (err) {
        console.log("err ",err);
      } else {
        bcrypt.compare(attemptedPassword, user.password, function(err, isMatch) {
          callback(isMatch);
        });
      }
    });
  };

  exports.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  };