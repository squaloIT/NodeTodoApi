var mongoose = require("mongoose");

mongoose.Promise = global.Promise; // Ovim se govori da ce mongoose koristiti globalne promise JS-a
mongoose.connect("mongodb://localhost:27017/TodoApi");

module.exports = { mongoose };