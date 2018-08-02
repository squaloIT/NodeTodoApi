// var env = process.env.NODE_ENV || 'development';
var env =  'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
console.log("Nacin rada.",env);
console.log("Port na kome se radi.",process.env.PORT);
console.log("MONGODB URI.",process.env.MONGODB_URI);