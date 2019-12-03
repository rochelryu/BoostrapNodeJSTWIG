let mongoose = require('mongoose');


const AutoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    firstname:{
        type: String,
        required: true,
    },

    nationnalite:{
        type: String,
        required: true,
    },
    profession:{
        type: String,
        required: true,
    },
    sexe:{
        type: String,
    },
    email:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    effetContrat:{
        type: String,
    },
    address:{
        type:String,
    },
    durrerContrat:{
        type: String,
    },
    immatriculation:{
        type: String,
        required: true,
    },
    typeCarte:{
        type: String,
        required: true,
    },
    marque:{
        type: String,
    },
    genre:{
        type: String,
    },
    chasis:{
        type: String,
    },
    puissanceVehicule:{
        type: String,
    },
    energie:{
        type: String,
    },
    nombreDePlace:{
        type: String,
    },
    nombreDePassager:{
        type: String,
    },
    cassorie:{
        type: String,
    },
    pv:{
        type: String,
    },
    ptac:{
        type: String,
    },
    cu:{
        type: String,
    },
    garantie:{
        type: String,
    },
    
    etat:{
        type:Number, default: 1,
    },
    profil:{
        type:String,
    },
    recovery:{type:Number},
    register_date: { type: Date, default: Date.now },
});
const Auto = mongoose.model('Auto', AutoSchema);
module.exports = Auto;







