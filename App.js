const Serveur = require('./Serveur');
let config = require('./Setting/config');
let fs = require('fs');
let db = require('./Model/Databases');
//ICION VA INITIALISER NOTRE BASE DE DONNée Car c'est ici le plus grand niveau
/*
JE vais utiliser MONGO DB comme SGBD car il va dans le principe de ce Projet.
 */


//Maintenant je lance mon serveur
db();
const serveur = new Serveur(config.port);
const {AdminQuerie} = require('./Controller/AdminQuerie');
const {Messagerie} = require('./Controller/Message');
/*serveur.start()*/
let app = require('http').Server(serveur.getApp());

let io = require( 'socket.io' )(app);

io.on('connection', function (socket) {
    console.log(socket.id)
    socket.on('rdv', async (data)=>{
        const code = "rdv"+Math.floor(Math.random()*9999)
        const age = (data.age)? data.age:"";
        const name = (data.name)? data.name:"";
        const commande = (data.commande)? data.commande:[];
        console.log(data.ident,name,age,code,"Render-vous",data.address, data.date,commande, data.autre, data.choice);
        console.log("/******BEGIN******/");
        const service = await AdminQuerie.setCommande(data.ident,name,age,code,"Render-vous",data.address,'',data.date, commande, data.autre, data.choice);
        if(service.etat){
            console.log("Etat avec succès");
            let info = {}
            const ville = await AdminQuerie.getAllMedecin();
            info.medecin = ville;
            info.service = service.user;
            io.emit("newService", info)
        }
    })
    socket.on('assurance', async (data)=>{
        const code = "assistance"+Math.floor(Math.random()*9999)
        const age = (data.age)? data.age:"";
        const name = (data.name)? data.name:"";
        const commande = (data.commande)? data.commande:"";
        const dates = new Date();
        console.log(data.ident,name,age,code,"Assistance",data.address,data.motif,dates,commande, data.autre, "Aucun");
        console.log("/******BEGIN******/");
        const service = await AdminQuerie.setCommande(data.ident,name,age,code,"Assistance",data.address,data.motif,dates,commande, data.autre, "Aucun");
        if(service.etat){
            let info = {}
            const ville = await AdminQuerie.getAllMedecin();
            info.medecin = ville;
            info.service = service.user
            io.emit("newService", info)
        }
    });

    socket.on('ass', async (data)=>{
        const code = "assistance"+Math.floor(Math.random()*9999)
        const numeroS = (data.numeroS)? data.numeroS:"N/A";
        const dates = new Date();
        console.log("/******BEGIN******/");
        const service = await AdminQuerie.setAssuranceSante(data.name,data.numero,data.nameUsage,data.address, data.birthDate,data.firstname,data.sexe,data.email,data.numeroS)
        if(service.etat){
    
            io.emit("newAssUV", service.resultat)
        }
        else{
            console.log(service);
        }
    });
    socket.on('assign', async (data)=>{
        data.decompose = data.address.split('-')
        const modif = await AdminQuerie.setCommandeAddFirstLevel(data.code,data.decompose[0],data.decompose[1],data.ident);
        if(modif.etat){
            const message = await Messagerie.sendMessage(modif.user.numero,modif.provider.medecin,modif.provider.ClinicName,modif.provider.clientName,modif.provider.date,modif.provider.code,modif.provider.serviceName)
        }
    });
    socket.on('send', async (data)=>{
        const message = await Messagerie.sendMessageClinic(data.me,data.numero,data.message)
    })
});
app.listen(config.port);

