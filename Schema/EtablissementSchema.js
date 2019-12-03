let mongoose = require('mongoose');


const EtablissementSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    nameResponsable:{
        type: String,
    },
    fonctionResponsable:{
        type: String,
    },
    contactUn:{
        type:String,
    },
    contactDeux:{
        type:String,
    },
    situationGeographique:{
        type:String
    },
    ville:{
        type:String
    },
    email:{
        type:String,
    },
    pays:{
        type:String,
    },
    complementaire:{
        type:String,
    },
    image:{
        type:String,
    },
    ouverture:{
        type:String,
    },
    
    fermerture:{
        type:String,
    },
    remboursement:{
        type:String,
    },
    specialite:[{name:String}],
    spec:{
        type:String,
    },
    tarif:[{name:String}],
    register_date: { type: Date, default: Date.now },
});
const Etablissement = mongoose.model('Etablissement', EtablissementSchema);
module.exports = Etablissement;
