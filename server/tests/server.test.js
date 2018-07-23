const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require("mongodb");

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const dummyTodos = [{
  _id: new ObjectID(),
  text:"First test todo"
},{
  _id: new ObjectID(),
  text:"Samo se zezaj i uzivaj u zivotu"
},{
  _id: new ObjectID(),
  text: "Zivot je kratak za gluposti glupe"
}];

beforeEach((done) => {
  Todo.remove({}).then(() =>{
    return Todo.insertMany(dummyTodos);
  }).then(() => done());
});

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