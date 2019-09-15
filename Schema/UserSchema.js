let mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    password:{
        type:String
    },
    ident:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    sexe:{type:String, required:true},
    prefix:{type:String, required:true},
    date:{type:String},
    services:[{code:String,serviceName:String,posAc:String,Motif:String,date:Date, heure:String,commande:[{nameDoc:String, qty:Number, price:Number}], registerDate:{ type: Date, default: Date.now }, medecin:String, ClinicName:String, autreProbleme:{type:String},choice:{type:String},del:{type:Number,default:1}, etat:{type:Number, default:1}}],
    address:{type:String},
    recovery:{type:Number, default: Math.floor(Math.random()*9999)},
    register_date: { type: Date, default: Date.now },
    login_date: { type: Date, default: null },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;