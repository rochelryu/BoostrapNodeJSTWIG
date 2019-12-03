let mongoose = require('mongoose');

const MedecinSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    code:{
        type:Number,
    },
    clinic:{
        type:String,
    },
    address:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    ouverture:{
        type:String,
    },
    fermerture:{
        type:String,
    },
    numeroSe:{
        type:String,
    },
    codePostale:{
        type:String,
    },
    
    numero:{
        type:String,
        required:true,
    },
    onm:{
        type:String,
    },
    pays:{
        type:String,
        required:true,
    },
    level:{
        type:Number,
    },
    specialite:{type:String},
    tarif:{type:String},
    moyenDePayement:{type:String},
    remboursement:{type:String},
    image:{type:String, default:"doctor.png"},
    register_date: { type: Date, default: Date.now },
});
const Medecin = mongoose.model('Medecin', MedecinSchema);
module.exports = Medecin;