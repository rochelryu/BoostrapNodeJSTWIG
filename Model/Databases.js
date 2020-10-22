let config = require('../Setting/config');
const {AdminQuerie} = require('../Controller/AdminQuerie');
let mongoose = require('mongoose');

//Connextion avec mongo
let connect = async ()=>{
    try {
        await mongoose.connect(config.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: config.db.useFindAndModify
        });
        //let admin = await AdminQuerie.setAdmin("admin@allo.ci", "0123456", "admin", "+22548803377", 3, "Allô Santé Express", "Abidjan/Cocody", "Côte d'Ivoire", "Allo Santé Express", "Administrateur", ["Tout"], ["Gratuit"]);

        console.log(">>>> Database Connected");
    }
    catch (e) {
        console.log(e.toString())
    }
}
module.exports =  connect
