const mongoose = require('mongoose');
const validator = require('validator');
const jwt =require("jsonwebtoken");
const _ = require("lodash");
const bcrypt= require("bcryptjs");

// import isEmail from 'validator/lib/isEmail';
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique:true,
    validate:{
      // validator: (value)=>{
      //   validator.isEmail(value);
      // },  
      validator: validator.isEmail,  
      // Na ovaj nacin je prosledjena funkcija isEmail za validator! Toj funkciji isEMail je prosledjen value.
      message:"{VALUE} is not a valid email."
    }
  }, 
  password:{
    type:String,
    required:true,
    minlength: 6
  },
  tokens: [{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});
//  ()=>{} ARROW FUNKCIJE NEMAJU THIS UNUTAR SEBE, JEDNOSTAVNO JE UNDEFINED DOK OVE NORMALNE BEZIMENE FUNKCIJE TO IMAJU !
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); //Zato sto je user mongoose obj

  return _.pick(userObject, ['_id','email']);
};
UserSchema.methods.generateAuthToken = function() {
  var user = this;  //OVDE JE INSTANCA PROMENLJIVE KOJA JE POZVALA METODU U THIS - UserSchema.methods

  var access = 'auth';
  var token = jwt.sign(
    { _id: user._id.toHexString(), access }, 'zezanjacExit2018').toString();

  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(()=>{ // Ovaj return vraca promise i omogucava da se drugi .then() nadovezuju na ovo.
    return token;  // OVaj return token ce biti returnovan u success funkciju then()
  });
};
UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
 
  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password, user.password, (err, res)=>{
          if(res)
            resolve(user);
          else
            reject("No user with that email and password");
      });
    });
  });
}
UserSchema.statics.findByToken = function(token){
  var User = this; // OVDE SE MODEL NALAZI U THIS - UserSchema.statics
  var decoded;
  
  try{
    decoded = jwt.verify(token, 'zezanjacExit2018');
  } catch(e) {
    // return new Promise((resolve,reject)=>{
    //   reject();
    // });          UMESTO OVOGA IDE ONO DOLE
    return Promise.reject();
    // Cela funkcija find by token vraca promise, koji se kasnije nadovezuje na User.findByToken(token).then((user) u server.js fajlu, zato smo mi u slucaju greske napravili novi vestacki promise koji poziva reject(), sto znaci da se u User.findByToken(token).then((user) nikada nece pozvati ova prva bezimena funkcija koja je prvi parametar then promise-a. Samim tim smo resili da se nece praviti novi korisnik. Reject() ce pozvati catch() iz server.js fajla
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token':token, // TRAZIM USERA SA OVIM VREDNOSIMA, KADA GOD TRAZIM NESTED PROPERTIES, ODNOSNO ONE KOJI IMAJU TACKU MORAM NAZIV SVOJSTVA STAVITI POD NAVODINIKE
    'tokens.access':'auth'
  });  //vraca promise
};

UserSchema.pre('save', function(next){
  var user = this;
  
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err,salt)=>{
      if(err){
        return console.log("Greska prilikom soljenja");
      } else {
        bcrypt.hash(user.password,salt,(err, hashedValue)=>{
          if(err){
            return console.log("Greska prilikom soljenja");
          } else {
            user.password=hashedValue;
            next();
          }
        });
      }
    });
  } else {
    next();
  }
});
// UserSchema.methods je objekat kome kao svojstva definisemo sve metode koje zelimo da nas model ima.
var User = mongoose.model('User', UserSchema);

module.exports = {User};
