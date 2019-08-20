let mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
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
    email:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:true,
    },
    etat:{
        type:Number,
        required:true,
    },
    clinicName:{
        type:String,
        required:true
    },
    address:{
        type:String,
    },
    recovery:{type:Number, default: Math.floor(Math.random()*9999)},
    register_date: { type: Date, default: Date.now },
    login_date: { type: Date, default: null },
});
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
