const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");

const dummyTodos = [{
    _id: new ObjectID(),
    text:"First test todo"
  },{
    _id: new ObjectID(),
    text:"Samo se zezaj i uzivaj u zivotu"
  },{
    _id: new ObjectID(),
    text: "Zivot je kratak za gluposti glupe",
    completed:true,
    completed: 123123213123
  }];
  const userOneId = new ObjectID();
  const userTwoId = new ObjectID();

  const users = [
      {
        _id:userOneId,
        email:'nikolicaPRikolica@gmail.com',
        password:'Nikolaa123',
        tokens:[{
            access: ' auth',
            token: jwt.sign({_id:userOneId, access:'auth'},"zezanjacExit2018").toString()
        }]
      }, 
      {
        _id:userTwoId,
        email:'stefanson@example.com',
        password:'Stefke123'
      }
  ];
  const populateTodos = (done) => {
    Todo.remove({}).then(() =>{
      return Todo.insertMany(dummyTodos);
    }).then(() => done());
  };

  const populateUsers = (done) => {
    User.remove({}).then(()=>{
        // users.forEach((user)=>{
        //     var noviKorisnik =new User(user);
        //     console.log("Sacuvan korisnik: ",noviKorisnik);
        //     var sacuvanKorisnik = noviKorisnik.save();
        //     usersForPromise.push(sacuvanKorisnik);
        // });
        var prviKorisnik = new User(users[0]).save();
        var drugiKorisnik = new User(users[1]).save();
        return Promise.all([prviKorisnik, drugiKorisnik]);
    }).then(() => done());
  };
  module.exports = {
      dummyTodos,
      users,
      populateTodos,
      populateUsers
  }