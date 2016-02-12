// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
// var db = require('bookshelf')(knex);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var db = mongoose.connection;

var userSchema = new mongoose.Schema ({
    url: String,
    username: String,
    password: String,
    createdAt: Date
  });

exports.User = mongoose.model('User', userSchema);

  var linkSchema = new mongoose.Schema ({
    url: String,
    baseUrl: String,
    code: String,
    title: String,
    visits: Number,
    createdAt: Date
});

exports.Link = mongoose.model('Link', linkSchema);

exports.mongoose = mongoose;


// // db.knex.schema.hasTable('urls').then(function(exists) {
// //   if (!exists) {
// //     db.knex.schema.createTable('urls', function (link) {
// //       link.increments('id').primary();
// //       link.string('url', 255);
// //       link.string('baseUrl', 255);
// //       link.string('code', 100);
// //       link.string('title', 255);
// //       link.integer('visits');
// //       link.timestamps();
// //     }).then(function (table) {
// //       console.log('Created Table', table);
// //     });
// //   }
// // });
// // MONGOOSE:


// // db.knex.schema.hasTable('users').then(function(exists) {
// //   if (!exists) {
// //     db.knex.schema.createTable('users', function (user) {
// //       user.increments('id').primary();
// //       user.string('username', 100).unique();
// //       user.string('password', 100);
// //       user.timestamps();
// //     }).then(function (table) {
// //       console.log('Created Table', table);
// //     });
// //   }
// // });

// // MONGOOSE:


