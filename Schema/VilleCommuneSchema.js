let mongoose = require('mongoose');


const VilleCommuneSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    prefix:{
        type: String,
        required: true,
    }
});
const VilleCommune = mongoose.model('VilleCommune', VilleCommuneSchema);
module.exports = VilleCommune;