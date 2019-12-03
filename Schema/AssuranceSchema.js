let mongoose = require('mongoose');


const SanteSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    nameUsage:{
        type: String,
        required: true,
    },
    firstname:{
        type:String
    },
    sexe:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    numeroS:{
        type:String,
    },
    address:{
        type:String,
    },
    etat:{
        type:Number, default: 1,
    },
    recovery:{type:String, default: Math.floor(Math.random()*9999).toString()},
    register_date: { type: Date, default: Date.now },
    birthDate: { type: Date },
});
const Sante = mongoose.model('Sante', SanteSchema);
module.exports = Sante;







