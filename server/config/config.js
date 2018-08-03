// var env = process.env.NODE_ENV || "development";
var env =  'development';
var configJSON = require("./config.json");
console.log(configJSON); 

if(env === 'development' || env ==='test'){

  var config = configJSON[env];
  Object.keys(config).forEach(function(key){
    process.env[key] = config[key];
  });

  console.log("PORT ", process.env.PORT);
  console.log("Mongo_URI ", process.env.MONGODB_URI);
  console.log("JWT_SECRET ", process.env.JWT_SECRET);
  console.log("JWT_SECRET typeof", typeof process.env.JWT_SECRET);
}

