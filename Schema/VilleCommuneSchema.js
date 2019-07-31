let mongoose = require('mongoose');


const VilleCommuneSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    commune:[{nameCommune:String}],
});
const VilleCommune = mongoose.model('VilleCommune', VilleCommuneSchema);
module.exports = VilleCommune;