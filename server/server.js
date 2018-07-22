var express = require("express");
var bodyParser = require("body-parser");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    var newTodo = new Todo({
        text: req.body.text
    });
    newTodo.save().then((doc)=>{
        console.log("Sacuvan novi Todo! ", doc);
        res.status(201).send("<h4>Todo uspesno upisan!</h4>");
    }, (e)=>{
        console.log("Greska prilikom cuvanja novog TodoA! ", e);
         res.status(400).send(e);
    });
});

app.post('/user', (req,res)=>{
    var newUser = new User({ email: req.body.email });
    newUser.save().then((doc)=>{
        res.status(201);
        res.send(doc);
        res.send("sve proslo kako treba");
    }, (e)=>{
        res.status(400);
        res.send(e);
    })
});


app.listen(port, ()=> {
    console.log(`Started on port ${port}. `);
});
// ZADATAK 
// email je jedini prop koji nam treba za model User, on mora da bude require, mora biti trimovan, tipa string i najmanje 1 karakter mora biti unet.

// var noviUser = new User({
//     email: "nikola.mihajlovic@ict.edu.rs"
// });
// noviUser.save().then(
//     (doc)=>{
//         console.log("Korisnik dodat! ",doc);
//     }, 
//     (e)=>{
//         if(e)
//             console.log("Greska prilikom unosa korisnika! ", e);
//     }
// );
// var newTodo = new TodoModel({
//     text: 'Ruckaj veceru'
// });

// newTodo.save().then(
//     (doc)=>{
//         console.log("Sacuvan Todo: ", doc);
//     },
//     (e)=>{
//         console.log("Greska: ",e);
//     }
// );

// var newTodo2 = new TodoModel({
//     text: 'Usisaj kucu',
//     completed:true,
//     completedAt: 123
// });

// newTodo2.save().then(
//     (doc)=>{
//         console.log(JSON.stringify(doc, undefined, 2));
//     },
//     (e)=>{
//         console.log("Greska: ",e);
//     }
// );