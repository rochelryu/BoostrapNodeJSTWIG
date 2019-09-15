let mongoose = require('mongoose');


const MedecinSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    clinic:{
        type:String,
        default: "Allô Santé Express"
    },
    address:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    pays:{
        type:String,
        required:true,
    },
    level:{
        type:Number,
    },
    specialite:{type:String},
    image:{type:String, default:"doctor.png"},
    register_date: { type: Date, default: Date.now },
});
const Medecin = mongoose.model('Medecin', MedecinSchema);
module.exports = Medecin;