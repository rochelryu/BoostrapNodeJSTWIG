let mongoose = require('mongoose');
const AutreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    level:{
        type: Number,
        required: true,
    }
});
const Autre = mongoose.model('Autre', AutreSchema);
module.exports = Autre;