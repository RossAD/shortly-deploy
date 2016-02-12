var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

var userController = require('../app/models/userController');

var crypto = require('crypto');

// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // mongoose
  Link.find(function (err, links){
    if  (err) { 
      res.send(err); 
    } else {
      res.send(200,links);
    }
  });
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  // refactor mongoose ----DONE!
  // create a link object
  Link.findOne({url:uri}, function (err, found) {
    if (err) {
      res.json(err);
    } else { 
      if (found) {
        res.send(200, found);
      } else {
          util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.send(404);
          }
          var newLink = new Link({
            url: uri,
            title: title,
            baseUrl: req.headers.origin
          });
          var shasum = crypto.createHash('sha1');
          newLink.code = shasum.digest('hex').slice(0, 5);
          Link.create (newLink, function (err, newLink) {
            if (err) {
             res.json(err);
            } else {
              res.json(newLink);
            }
        });
      });
    }  
  }
 }); 
};
  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });


exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // refactor using mongoose ---- DONE!
  User.findOne({username : username}, function(err, user){
    if(err){
      res.send(err);
    } else {
      if (!user) {
        console.log("User not found: ", err);
        res.redirect('/login');
      } else {
        console.log("user in login ",user);
          userController.comparePassword(password, username, function(match){ 
            if(match) {
              util.createSession(req, res, user);
            } else {
              console.log("incorrect login res", match);
              res.redirect('/login');
            }
          });
        }
      }
  });
};
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // refactor using mongoose syntax --- DONE!
  User.findOne({ username: username }, function(err, user){
    if (err) {
        res.send(err);
      } else {
        if (!user) {
          var newUser = new User({
            username: username,
            password: password
          });
          User.create(newUser, function(err, newUser){
            if(err){
              console.log('Something Broke!', err);
            } else {
              util.createSession(req, res, newUser);
            }
          });
        } else {
          console.log('Account already exists');
          res.redirect('/signup');
        }
      }
      

  });
};

exports.navToLink = function(req, res) {
  // refactor mongoose
  console.log("req in navtgolink ",req);
  Link.findOne({code: req.params[0]} , function (err, link) {
    if (err) {
      console.log("navtolink err ", err);
    } else {
      // find
      if (!link) {
        res.redirect('/');
      } else {
        link.update({$inc: {visits:1}}, function (err, raw) {
          if (err) {
            console.log("err: ",err);
          } else
          console.log("link in navToLink ",link);
            res.redirect(link.url);
        });//visits +1})
      }
    }
  });
};

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
