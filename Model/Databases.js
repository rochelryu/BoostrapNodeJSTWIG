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
        await AdminSchema.deleteMany({name:"admin"}).then((res)=>{
            console.log("Supprimé")
        }).catch((err)=>{
            console.log("err Supprimé" + err)
        });

        await VilleCommuneSchema.deleteMany({name:"Abidjan"}).then((res)=>{
            console.log("Supprimé")
        }).catch((err)=>{
            console.log("err Supprimé" + err)
        });
        let Ville = new VilleCommuneSchema({name:"Côte d'Ivoire", prefix:"+225"});
        let Ci = new VilleCommuneSchema({name:"RDC", prefix:"+243"});
        let Dt = new VilleCommuneSchema({name:"France", prefix:"+33"});
        let TH = new VilleCommuneSchema({name:"Algérie", prefix:"+213"});
        await Ville.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        await Ci.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        await Dt.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        await TH.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        let admin = new AdminSchema({clinicName:"Allô Santé Express",name:"admin",password:"3c0196740abffc0a1341f249dc4504cb0a1466f71ff86272606e88fec72bb4e1", ident:"super"+Math.floor(Math.random()*9999), email:"admin@allo.ci", numero:"48803377", etat:3, address:"N/A"});
        await admin.save().then(res=>{console.log("admin Default")}).catch(err=>{console.log("admin Eree")})
        console.log(">>>> Database Connected");
    }
    catch (e) {
        console.log(e.toString())
    }
}
module.exports =  connect
