const Serveur = require('./Serveur');
let config = require('./Setting/config');
//ICION VA INITIALISER NOTRE BASE DE DONNée Car c'est ici le plus grand niveau
/*
JE vais utiliser MONGO DB comme SGBD car il va dans le principe de ce Projet.
 */


//Maintenant je lance mon serveur
console.log(config.port)
const serveur = new Serveur(config.port);
serveur.start();

