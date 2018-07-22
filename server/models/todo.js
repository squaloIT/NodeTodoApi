var mongoose = require("mongoose");

var TodoModel = mongoose.model("Todo",{
    text: {
        type: String, // Kada bih pokusao da upisem broj umesto stringa, to bi PROSLO zbog implicitne konverzije! Moramo da vodimo racuna o tome i tome sluze validatori
        required: true,
        minlength: 3,
        trim: true
    },
    completed: {
        type: Boolean,
        default:false
    },
    completedAt: {
        type: Number,
        default: null
    }
}); //Pravi se Model koji se kasnije koristi za pravljenje objekta po tom kalupu, i kao takav se kasnije ubacuje u bazu
module.exports = {Todo: TodoModel};