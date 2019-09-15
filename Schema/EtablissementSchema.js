let mongoose = require('mongoose');


const EtablissementSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    nameResponsable:{
        type: String,
        required: true,
    },
    fonctionResponsable:{
        type: String,
        required: true,
    },
    contactUn:{
        type:String,
        required:true,
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
        required:true,
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
    specialite:[{name:String}],
    register_date: { type: Date, default: Date.now },
});
const Etablissement = mongoose.model('Etablissement', EtablissementSchema);
module.exports = Etablissement;
