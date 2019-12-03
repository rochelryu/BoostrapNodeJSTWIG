
let mongoose = require('mongoose');


const VoyageSchema = new mongoose.Schema({
    name:{
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
    paysOr:{
        type:String,
    },
    paysDest:{
        type:String,
    },
    address:{
        type:Number,
    },
    etat:{
        type:Number, default: 1,
    },
    changeNumberDeJours:{
        type:Number,
    },
    passport:{
        type:String,
    },
    recovery:{type:Number},
    register_date: { type: Date, default: Date.now },
    birthDate: { type: Date, default: null },
});

const Voyage = mongoose.model('Voyage', VoyageSchema);
module.exports = Voyage;
