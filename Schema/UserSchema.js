let mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    password:{
        type:String
    },
    profil:{
        type:String,
        default: ""
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
    date:{type:String},
    services:[{code:String,serviceName:String,posAc:String,Motif:String,date:Date, heure:String,commande:[{nameDoc:String, qty:Number, price:Number}], registerDate:{ type: Date, default: Date.now }, medecin:String, ClinicName:String, autreProbleme:{type:String},choice:{type:String},del:{type:Number,default:1}, etat:{type:Number, default:1}}],
    prescription:[{code:String,medoc:String, Description:String, registerDate:{ type: Date, default: Date.now }, medecin:String, ClinicName:String,del:{type:Number,default:1}, etat:{type:Number, default:1}}],
    address:{type:String},
    recovery:{type:Number },
    register_date: { type: Date, default: Date.now },
    login_date: { type: Date, default: null },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;