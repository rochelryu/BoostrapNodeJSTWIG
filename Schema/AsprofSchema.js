let mongoose = require('mongoose');


const AsProSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    address:{
        type:String,
    },
    etat:{
        type:Number, default: 1,
    },
    genre:{
        type:String,
    },
    recovery:{type:Number, default: Math.floor(Math.random()*9999)},
    register_date: { type: Date, default: Date.now },
});
const AsProf = mongoose.model('AsProf', AsProSchema);
module.exports = AsProf;







