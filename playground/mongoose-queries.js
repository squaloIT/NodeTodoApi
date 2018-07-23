const {ObjectID} = require("mongodb");
// ObjectID.isValid je metod koji uzima _id i proverava da li je on validan ili ne. Vraca true ili false.

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// var id = "5b55c5547174180e08517f2612";

// if(!ObjectID.isValid(id)){
//     console.log("_id not valid");
//     return;
// }

// Todo.find({
//     _id: id 
// }).then((todos)=>{
//     if(todos.length === 0)
//         return console.log("Todos not found");
//     console.log("Todos", todos);
// }); // Zahvaljujuci mongoose-u mozemo ovako da proveravamo neki id, nema potrebe za pravljenem ObjectID jer mongoose to radi sam za nas. On ce sam prebciti ovaj string koji je ustvari id u ObjectID i tek onda izvrsiti upit i proveru.

// Todo.findOne({  // FindOne dohvata samo jedan jedini dokument, ako ih ima vise samo prvi.
//     _id:id
// }).then((todo)=>{
//     if(!todo)
//         return console.log("Id not found");
//     console.log("One todo",todo);
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo)
//         return console.log("Id not found");
//     console.log("Todo by id", todo);
// }).catch((e)=>{
//     console.log("Greska! ",e);
// });

var id="5b55d055f0a19b4a5fa59f19";
User.findById(id).then((user)=>{
    if(!ObjectID.isValid(id))
        return console.log("User id is not valid!");

    if(!user)
        return console.log("User not found!", user);
    
    console.log("User found: ", user);
}).catch((e)=>{
    console.log("Greska! ",e);
});