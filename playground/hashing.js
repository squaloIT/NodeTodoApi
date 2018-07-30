const jwt =require("jsonwebtoken");
const {SHA256}= require("crypto-js");

var message = "Nikola drago mi je ";

var hash = SHA256(message).toString();
// console.log("Message :", message);
// console.log("Hash :", hash);

var data = {
    id:5
};
var token = jwt.sign(data, 'zezanjac'); //Uzima obj i pravi hash od data i vraca token.
console.log(token);
var decoded = jwt.verify(token, 'zezanjac'); //Dok verify vodi racuna da se data koji smo sign-ovali i hashovali u token nije promenio u medjuvremenu, to znamo tako sto prosledimo token i "salt" kojim smo "posolili" 
console.log(decoded);