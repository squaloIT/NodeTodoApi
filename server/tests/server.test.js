const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

beforeEach((done)=>{
    Todo.remove({}).then(()=> done());
});

describe("POST /todos", ()=> {
    it("Da upise novi todo", (done)=>{
        var text = "Neki text za todo";

        request(app)
            .post("/todos")
            .send({text})
            .expect(201)
            .expect((res) => {
                expect(res.body.text).toBe(text );
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
 
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it("Ne bi trebalo da napravi todo zbog loseg prosledjivanja", (done)=>{
       request(app)
        .post("/todos")
        .send({})
        .expect(401)
        .end((err,res)=>{
            if(err)
                return done(err);
            
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(0);
                done();
            }).catch((e) => done(e));
        }) 
    });
});