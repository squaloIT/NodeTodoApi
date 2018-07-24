const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// Metodi za brisanje koje nudi mongoose su 

// Todo.remove({}) nam dozvoljava da obrisemo sve dokumente koji se poklapaju sa prosledjenim objektom. NE MOZE SE KORISTITI BEZ PARAMETRA I AKO ZELIMO OBRISATI SVE DOKUMENTE IZ KOLEKCIJE MORAMO PROSLEDITI PRAZAN OBJEKAT

Todo.remove({}).then((result)=>{
    console.log(result); // Ovim smo obrisali sve 
});

//Todo.findOneAndRemove() // Je tu da pronadje prvi element koji se poklapa sa onim sto mu je prosledjeno kao objekat i naravno da ga obrise kada ga nadje. On kao return vraca upravo taj obrisani dokument i onda ga mozemo prikazati korisniku ili nesto raditi sa njim.

// Todo.findByIdAndRemove() // Je tu da pronadje element koji se poklapa sa onim ID koji je prosledjen i naravno da ga obrise kada ga nadje. On kao return vraca upravo taj obrisani dokument i onda ga mozemo prikazati korisniku ili nesto raditi sa njim.