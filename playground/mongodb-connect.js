// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return  console.log("Unable to connect to mongodb server.");
    } 
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection("Todos").insertOne({
    //     text: 'NEsto za uraditi 2',
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log("Ne mogu uneti novi todo",err);
    //     } 
    //     console.log(JSON.stringify(result.ops,undefined, 2));
    // });

    // db.collection("user").insertOne(
    //     {
    //         name:'NoviUser',
    //         age:43,
    //         location:'Beograd'
    //     }, (err, data)=>{
    //     if(err){
    //         return console.log(err);
    //     }
    //     //console.log(JSON.stringify(data, undefined, 2));
    //     console.log(data.ops[0]._id.getTimestamp());
    // });
    client.close();
});