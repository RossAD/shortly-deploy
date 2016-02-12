var bcrypt = require('bcrypt-nodejs');
var User = require('./user.js');
var Promise = require('bluebird');

 var mongoose = require('mongoose');
  exports.initialize = function() {
    this.on('creating', this.hashPassword);
  };

  exports.comparePassword = function(attemptedPassword, user, callback) {
    // Refactor mongoDB
    User.findOne({username: user}, function (err, user) {
      if (err) {
        console.log("err ",err);
      } else {
        console.log("compar pass ", attemptedPassword, user.password);
        if (attemptedPassword === user.password) {
          callback(true);
        } else {
          callback(false);
        }
        // bcrypt.compare(attemptedPassword, user.password, function(err, isMatch) {
        //   console.log("match ",isMatch);
        //   callback(isMatch);
        // });
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