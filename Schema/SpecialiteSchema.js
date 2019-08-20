let mongoose = require('mongoose');


const SpecialiteSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    register_date: { type: Date, default: Date.now },
});
const Specialite = mongoose.model('Specialite', SpecialiteSchema);
module.exports = Specialite;