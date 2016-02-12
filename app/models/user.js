//var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('bluebird');
var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password:{
    type: String,
    required:true
  }
})

User=mongoose.model("User",userSchema);
User.comparePassword = function(candidatePassword, savedPassword, callback){
  bcrypt.compare(candidatePassword, savedPassword, function(error, isMatch){
    if(error){ 
      return callback(error);
    }
    calllback(null, isMatch);
  });
};

userSchema.pre("save", function(next){
  var cipher = bluebird.promisfy(bcrypt.hash);
  return cipher(this.password,null,null).bind(this)
    .then(function(hash){
      this.password=hash;
      next();
    })
})
module.exports=User;

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;
