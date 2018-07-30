const jwt =require("jsonwebtoken");
const {SHA256}= require("crypto-js");
const bcrypt= require("bcryptjs");

var message = "Nikola drago mi je ";

var hash = SHA256(message).toString();
// console.log("Message :", message);
// console.log("Hash :", hash);

// var data = {
//     id:5
// };
// var token = jwt.sign(data, 'zezanjac'); //Uzima obj i pravi hash od data i vraca token.
// console.log(token);
// var decoded = jwt.verify(token, 'zezanjac'); //Dok verify vodi racuna da se data koji smo sign-ovali i hashovali u token nije promenio u medjuvremenu, to znamo tako sto prosledimo token i "salt" kojim smo "posolili" 
// console.log(decoded);
var criptovana;
var password = "123abc!";
bcrypt.genSalt(10,(err, salt)=>{
    bcrypt.hash(password, salt, (err, hash)=>{
        console.log(hash);
    });
});     // OVAKO SE GENERISE POSOLJENA SIFRA UZ POMOC BCRYPT-A

var passHash = "$2a$10$7iURHx18jD8yY0O1ywAG..jF9lUBhkxe5SQ0XTCK1DaHvvgRgl9m.";

bcrypt.compare(password, passHash, (err, res)=>{
    console.log("Da li su isti password i passHash",res);
});
