var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require("mongodb");

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// DOhvatanje svih Todos
app.get("/todos", (req,res)=>{
  Todo.find().then((todos)=>{
    res.status(200).send({todos});
  }, (error)=>{
    res.status(400).send(error);
  });
});

//Dohvatanje todo-a ciji je id prosledjen
app.get("/todos/:id",(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(406).send("ID u have entered is not valid");
    return console.log("ID u have entered is not valid");
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      res.status(404).send("Todo with given id does not exist");
      return console.log("Todo with given id does not exist");
    }
    res.status(200).send({todo});

  }).catch((e)=>{
    res.status(400).send();
  });
});

//Dohvatanje svih user-a
app.get("/users", (req,res)=>{
  User.find().then((users)=>{
    res.status(200).send({users});
  },
  (err)=>{
    res.status(400).send(` Greska sa servera: ${err}`);
  });
});

app.delete("/todos/:id", (req, res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(406).send();
  }

  Todo.findByIdAndRemove(id).then((doc)=>{
    if(!doc)
      return res.status(404).send({error:"Document does not exist"});
    else 
      res.status(200).send({todo:doc});
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
