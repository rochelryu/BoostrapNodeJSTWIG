let mongoose = require('mongoose');


const MedocSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    ordonnance:{
        type: Boolean,
    },
    price:{
        type: String,
        required: true,
    },
    familie:{
        type: String,
    },
    recovery:{
        type:Number
    }
});
const Medoc = mongoose.model('Medoc', MedocSchema);
module.exports = Medoc;