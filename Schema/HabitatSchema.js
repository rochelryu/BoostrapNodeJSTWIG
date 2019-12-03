let mongoose = require('mongoose');

const HabitatSchema = new mongoose.Schema({
    nameFile:{
        type: String,
        required: true,
    },
    etat:{
        type:Number, default: 1,
    },
    recovery:{type:Number, default: Math.floor(Math.random()*9999)},
    register_date: { type: Date, default: Date.now },
});
const Habitat = mongoose.model('Habitat', HabitatSchema);
module.exports = Habitat;