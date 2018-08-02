require('./../config/config');

const _ = require("lodash");
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require("mongodb");

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT;

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

app.patch("/todos/:id",(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body, ["text","completed"]); // funkcija pick bukvalno 'izvadi svojstva' iz nekog objekta i ubaci ih kao svojstva promenljive koju definisemo (body)

  if(!ObjectID.isValid(id)){
    return res.status(406).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt =  new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({ todo });
    
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.post("/users",(req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken(); // Ovaj return ide u sledeci then

  }).then((token)=>{
    console.log(user);
    res.header("x-auth",token).send(user); 
    // Kada se u header stavlja x-nesto, to znaci da je to custom header koji http ne mora da poznaje, i sluzi programeru 
  }).catch((e)=>{    
    res.status(400).send(e);
  });
});

app.post('/users/login', (req,res)=>{
  var body = _.pick(req.body, ['email',"password"]);
  
  User.findByCredentials(body.email, body.password).then((user)=>{
    
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }
  // , (err)=>{
  //   res.status(400).send(err);
  // }
  ).catch((err)=>{
    res.status(400).send(err);
  });
});

app.get("/users/me", authenticate, (req, res)=>{ //DODAT PARAMETAR authenticate KOJI JE USTVARI MIDDLEWARE

    res.send(req.user); // POSTAVLJEN REQUEST U MIDDLEWARE-U authenticate

});
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
