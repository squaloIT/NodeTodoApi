const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return  console.log("Unable to connect to mongodb server.");
    } 
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //deleteOne() - Brise jedan red
    // db.collection('Todos').deleteMany({text:'Jedi krastavac'}).then((result)=>{
    //     console.log(result);
    // });

    // //deleteMany() - Brise vise redova
    // db.collection('Todos').deleteOne({text:'Jedi krastavac 2'}).then((result)=>{
    //     console.log(result);
    // });

    // //findOneAndDelete() - Brise jedan red ali i vraca vrednosti tog obrisanog reda
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //     console.log(result); //result.value cuva vrednost koja nas interesuje a to su podaci obrisanog dokumenta.
    // });

    //ZADATAK - obrisati jednog usera sa nekim ID
    db.collection('user').findOneAndDelete({_id: 123}).then((result)=>{
        console.log("Obrisani user: ",JSON.stringify(result.value, undefined, 2));
    },(err)=>{
        if(err)
            console.log(`Greska prilikom brisanja reda sa ID - 5b40d368c5e9b91110cbfbf4`);
    });
    // Ako se postavi neki id tipa 123, onda to nije ObjectID i treba se brisati kao broj.

    //client.close();
});