let config = require('../Setting/config');
let VilleCommuneSchema = require('../Schema/VilleCommuneSchema');
let AdminSchema = require('../Schema/AdminSchema');
let mongoose = require('mongoose');

//Connextion avec mongo
let connect = async ()=>{
    try {
        await mongoose.connect(config.db.url, {
            useNewUrlParser: true,
            useFindAndModify: config.db.useFindAndModify
        });
        let Ville = new VilleCommuneSchema({name:"Abidjan",commune:[{nameCommune:"Adjamé"},{nameCommune:"Abobo"},{nameCommune:"Yopougon"},{nameCommune:"Rivera"},{nameCommune:"Cocody"},{nameCommune:"II Plateaux"},]});
        await Ville.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        let admin = new AdminSchema({clinicName:"Allô Santé Express",name:"admin",password:"3c0196740abffc0a1341f249dc4504cb0a1466f71ff86272606e88fec72bb4e1", ident:"super"+Math.floor(Math.random()*9999), email:"admin@allo.ci", numero:48803377, etat:3});
        await admin.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        console.log(">>>> Database Connected");
    }
    catch (e) {
        console.log(e.toString())
    }
}
module.exports =  connect
