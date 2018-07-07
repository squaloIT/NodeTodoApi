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

    //var allTodosCursor = db.collection('Todos').find(); // Ovo vraca cursor koji ukazuje na redove koji su vraceni. Ovaj kursor ima hrpu svojih metoda koje mozemo koristiti. NAJCESCE KORISCEN JE toArray() KOJI VRACA PROMISE!

    //var completedTodos = db.collection('Todos').find({_id:false}); //Ovim objektom koji je tu kao parametar sam ja rekao da dohvatam sve dokumente koji kao svojstvo completed imaju false. Where completed = false;

    // var todosWithSomeID = db.collection('Todos').find(
    //     {
    //         _id: new ObjectID('5b40da61a33ba04a8fe43d2a')
    //     }); // _id ne bih mogao da definisem kao string niti kao number, jer jednosavno on nije string vec je objekat tipa ObjekatID, zato kada zelim da pretrazujem po njemu treba da napravim novi objekat i onda ga prosledim.

    // todosWithSomeID.toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined, 2));
    // }, (err)=>{
    //     console.log("Unable to fetch Todos. ",err);
    // });

    // var todosWithSomeID = db.collection('Todos').find(); 
    //Count je tu da prebroji koliko redova se vraca prilikom dohvataca svega, tj na koliko redova ukazuje kursor koji vraca funkcija find().
    // todosWithSomeID.count().then((count)=>{ 
    //     console.log(`Todos count: ${count}`);
    // }, (err)=>{
    //     console.log("Unable to fetch Todos. ",err);
    // });

    // ZADATAK  

    db.collection('user').find({age:20}).toArray().then((data)=>{
        console.log(JSON.stringify(data,undefined,2));
    },(err)=>{
        if(err)
            console.log("Unable to fetch users.",err);
    });
    db.collection('user').find({age:20}).count().then((count)=>{
        console.log(`Broj ljudi koji imaju 20 godina je: ${count}`);
    },(err)=>{
        if(err)
            console.log('Greska prilikom dohvatanja broj korisnika koji imaju 23 godine.');
    });

    // client.close();
});