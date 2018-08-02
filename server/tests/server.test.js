const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require("mongodb");

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummyTodos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe("GET /todos", ()=>{
  it("should get all dummy todos", (done)=>{
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
    });
});
describe("DELETE /todos/:id",()=>{
  it("Bi trebalo da obrise dokument", (done)=>{
    var hexID = dummyTodos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexID);
      }).end((err, res)=>{
        if(err)
          return done(err);
        
        Todo.findById(hexID).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=>done(e));
      });
  });

  it("Bi trebalo da vrati 404 ako dokument nije pronadjen", (done)=>{
    var noviID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${noviID}`)
      .expect(404)
      .expect((res)=>{
        expect(res.body.error).toBe("Document does not exist", "Text greske koja se vraca sa servera nije dobra!");
      }).end(done);
      
  });
  it("Bi trebalo da vrati 406 ako prosledjeni id nije validan", (done)=>{
    request(app)
      .delete("/todos/12345")
      .expect(406)
      .end(done);
  });
});


describe("PATCH /todos/:id", ()=>{
  it("Bi da promeni todo", (done)=>{
    var idHex = dummyTodos[1]._id.toHexString();
    request(app)
      .patch("/todos/"+idHex)
      .send({ text:"Promenjeno zezanje", completed:true })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(idHex);
        expect(res.body.todo.completed).toBeTruthy();
        expect(res.body.todo.text).toBe("Promenjeno zezanje");
        expect(res.body.todo.completedAt).toBeA("number");
      }).end(done);
  });

  it("Bi da promeni completedAt kada todo nije zavrsen", (done)=>{
    var idHex = dummyTodos[1]._id.toHexString();
    request(app)
    .patch("/todos/"+idHex)
    .send({ text:"Promenjen completed u false", completed:false })
    .expect(200)
    .expect((res)=>{
      // expect(res.body.todo._id).toBe(idHex);
      expect(res.body.todo.completed).toBeFalsy();
      expect(res.body.todo.text).toBe("Promenjen completed u false");
      expect(res.body.todo.completedAt).toNotExist();
    }).end(done);
  });
});



describe("GET /todos/:id", ()=>{
  it("Should return todo document", (done)=>{
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", (done)=>{
    //budi siguran da se vratio 404
    // var testID = new ObjectID("5b55c5547174180e08517f99");  OVAKO SAM JA 
   var hexID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids", (done)=>{
    request(app)
      .get("/todos/12345")
      .expect(406)
      .end(done);
  });
});

describe("GET /users/me", ()=>{
  it("Bi trebalo da vrati korisnika ako je ulogovan", (done)=>{
    console.log("Token iz server.test.js ",users[0].tokens[0].token);
    console.log("Typeof ",typeof users[0].tokens[0].token);
    request(app)
      .get(`/users/me`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        // expect(res.body.tokens.token).toBe(users[0].tokens.token);
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it("Bi trebalo da vrati 401 ako nije ulogovan", (done)=>{
    request(app)
      .get(`/users/me`)
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("GET /users", ()=>{
  it("Bi trebalo da kreira korisnika", (done)=>{
    var email="example@example.com";
    var password="123mnb!";

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      }).end((err)=>{
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });
  it("Bi da dodje do greske prilikom validacije", (done)=>{
    var email="and";
    var password="123!";

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
  it("Ne bi trebalo da kreira korisnika jer isti postoji", (done)=>{
    var email=users[0].email;
    var password="123mnb123!";

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});