let mongoose = require('mongoose');
const AutreSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    level:{
        type: Number,
    }
});
const Autre = mongoose.model('Autre', AutreSchema);
module.exports = Autre;