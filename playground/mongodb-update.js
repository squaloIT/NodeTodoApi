const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return  console.log("Unable to connect to mongodb server.");
    } 
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //findOneAndUpdate()
    // db.collection('Todos').findOneAndUpdate({
    //         _id: new ObjectID('5b436753a33ba04a8fe44770')
    //     },{
    //         $set: {
    //             completed: true
    //         }
    //     }, {
            //returnOriginal: false // funkcija findOneAndUpdate vraca jedan red, i ova opcija nam omogucava da odlucimo da li zelimo da nam vrati promenjen red, ili onakakv kakv je bio pre menjanja. Posto zelimo da vrati red nakon promene onda je ova vrednost false.+
        //}
        // Drugi parametar je operator koji govori na koji nacin cemo promeniti red koji ispunjava uslovj koji je postavljen kao prvi parametar - U ovom slucaju koji ima id taj i taj.
        // Opcije su naprimer rename - menja ime svojstva, $min - menja vrednost samo ako je vrednost koju zelimo da postavimo manja od one koja je vec unutar dokumenta, $max - menja vrednost elementa ako je vrednost koju zelimo da postavimo veca od vrednosti koja je predhodno bila postavljena
        // Najkoriscenija opcija je $set koja jednostavno postavlja vrednost polja.
// ).then((result)=>{
//     console.log(result);
// });

// ZADATAK 

db.collection('user').findOneAndUpdate({ 
    name: 'Andrijana'
    },{
        $set: { 
            name: 'Jovana',
        }, 
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    }, (err)=>{
        if(err)
            console.log("Greska prilikom menjanja vrednosti: ", err);
    });
    //client.close();
});