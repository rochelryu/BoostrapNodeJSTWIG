let mongoose = require('mongoose');


const MedecinSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    clinic:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    specialite:{type:String},
    register_date: { type: Date, default: Date.now },
});
const Medecin = mongoose.model('Medecin', MedecinSchema);
module.exports = Medecin;