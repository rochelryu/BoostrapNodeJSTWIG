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
const {Messagerie, OrangeTocken} = require('./Controller/Message');
/*serveur.start()*/
//OrangeTocken();
//SendOrange("+22548803377", "Hello World");
let app = require('http').Server(serveur.getApp());

let io = require( 'socket.io' )(app);

io.on('connection', async (socket) => {
    console.log(socket.id);
    socket.on('rdv', async (data)=>{
        const code = "rdv"+Math.floor(Math.random()*9999)
        const age = (data.age)? data.age:"";
        const name = (data.name)? data.name:"";
        const commande = (data.commande)? data.commande:[];
        const service = await AdminQuerie.setCommande(data.ident,name,age,code,"Render-vous",data.address,'',data.date, commande, data.autre, data.choice);
        if(service.etat){
            console.log("just", service);
            let info = {}
            const ville = await AdminQuerie.getAllAdmin();
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
        const service = await AdminQuerie.setCommande(data.ident,name,age,code,"Assistance",data.address,data.motif,dates,commande, data.autre, "Aucun");
        if(service.etat){
            let info = {}
            const ville = await AdminQuerie.getAllMedecin(2);
            info.medecin = ville;
            info.service = service.user
            io.emit("newService", info)
        }
    });
    socket.on('finish', async(data)=>{
        const valider = await AdminQuerie.setServiceFinale(data.ele);
        console.log(valider);
        io.emit('final', valider);
    })
    socket.on("delMedecin", async(data)=>{
        const code = parseInt(data,10);
        const del = await AdminQuerie.delMedecin(code);
        console.log(del);
    
    })


    socket.on("delEtablissement", async(data)=>{
        const del = await AdminQuerie.delEtablissement(data);
    })

    socket.on("delAdmin", async(data)=>{
        const del = await AdminQuerie.delAdmin(data);
    })

    socket.on('ass', async (data)=>{
        const numeroS = (data.numeroS)? data.numeroS:"N/A";
        const dates = new Date();
        const service = await AdminQuerie.setAssuranceSante(data.name,data.numero,data.nameUsage,data.address, data.birthDate,data.firstname,data.sexe,data.email,data.numeroS);
        if(service.etat){
            io.emit("newAssUV", service.resultat)
        }
        else{
            console.log(service);
        }
    });

    socket.on("assAutoV", async(data)=>{
        const service = await AdminQuerie.setAssuranceAuto(data);
        if(service.etat){
            io.emit("newAssAuto", service.resultat)
        }
        else{
            console.log(service);
        }
        /*fs.writeFile(__dirname+'/exe.txt', JSON.stringify(data),(err)=>{
            if(err) console.log(err)
            console.log('terminé')
        })*/
    })
    socket.on("assAutoM", async(data)=>{
        const service = await AdminQuerie.setAssuranceMoto(data);
        if(service.etat){
            io.emit("newAssMoto", service.resultat)
        }
        else{
            console.log(service);
        }

    })
    socket.on('assProfessionnelle', async (data)=>{
        const service = await AdminQuerie.setAssurancePro(data.name,data.numero,data.ville + ' / ' + data.commune,data.email, data.genre);
        if(service.etat){
            io.emit("newAssUVPro", service.resultat)
        }
        else{
            console.log(service);
        }
    });
    

    socket.on('delVill', async(data)=>{
        const delEle = await AdminQuerie.delVille(data);
    })
    socket.on('delAutre', async(data)=>{
        const delEle = await AdminQuerie.delAutre(data);
    })
    socket.on('assVoyage', async (data)=>{
        const service = await AdminQuerie.setAssuranceVoyage(data.name,data.numero,data.origine,data.destination,data.birthDate,data.firstname,data.sexe,data.changeNumberDeJours, data.passport)
        if(service.etat){
            io.emit("newAssUVV", service.resultat);
        }
        else{
            console.log(service);
        }
    });
    socket.on('assign', async (data)=>{
        const modif = await AdminQuerie.setCommandeAddFirstLevel(data.code,data.medecin,data.ident);
        if(modif.etat){
            const med = await AdminQuerie.getMedecinByName(data.medecin);
            const message = await Messagerie.sendOrangeAssistance(modif.user.numero,modif.provider.medecin,modif.user.prefix,modif.provider.code,modif.user.name);
            const cont = await Messagerie.sendOrangeAssistanceForMedecin(med.numero,"",modif.user.name, modif.provider.autreProbleme, modif.provider.Motif,modif.provider.posAc,modif.user.numero)
            const secondMessage = (modif.numeroSe !="") ? await Messagerie.sendOrangeAssistanceForMedecin(med.numeroSe,"",modif.user.name, modif.provider.autreProbleme, modif.provider.Motif,modif.provider.posAc,modif.user.numero): "";

        }
    });
    
    socket.on('AssuranceValidate', async (data)=>{
        if(data.type === "Voyage"){
            const beta = await AdminQuerie.updateAssuranceVoyageByRecovery(data.code)
        }
        else if(data.type === "Santé"){
            const beta = await AdminQuerie.updateAssuranceByRecovery(data.code)

        }
        else if(data.type === "Professionnels"){
            const beta = await AdminQuerie.updateProfessionnelByRecovery(data.code)

        }
        else if(data.type === "Auto"){
            const beta = await AdminQuerie.updateAutoByRecovery(data.code)

        }
        else if(data.type === "Moto"){
            const beta = await AdminQuerie.updateMotoByRecovery(data.code)
        }
    })
    socket.on('assignRDV', async (data)=>{
        const modif = await AdminQuerie.setCommandeAddFirstLevelForRDV(data.code,data.ClinicName,data.ident, data.hour);
        if(modif.etat){
            const { address } = await AdminQuerie.getEtablissementByName(modif.provider.ClinicName);

            const message = await Messagerie.sendOrangeRdv(modif.user.numero, modif.provider.ClinicName,modif.user.prefix,modif.provider.code,modif.provider.date,modif.provider.heure, modif.provider.autreProbleme, address) //.sendMessage(modif.user.numero,modif.provider.medecin,modif.provider.ClinicName,modif.provider.clientName,modif.provider.date,modif.provider.code,modif.provider.serviceName)
        }
    });
    socket.on('sendValidation', async (data)=>{
        const demande = await AdminQuerie.getServiceByClinicNameAndCode(data.me,data.numero);
        console.log(demande);
        if(demande){
            socket.emit("result", demande);
        }
        else{
            socket.emit('aucunResult')
        }
        //const message = await Messagerie.sendMessageClinic(data.me,data.numero,data.message)
    })
    socket.on('send', async (data)=>{
        const message = await Messagerie.sendSmsClinique(data.numero,data.message)
    })
});
app.listen(config.port);

