let mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    code:String,serviceName:String,posAc:String,Motif:String,date:Date, heure:String, commande:[{nameDoc:String, qty:Number, price:Number}], registerDate:{ type: Date, default: Date.now }, medecin:String, ClinicName:String, etat:{type:Number, default: 1},
    ident:{type:String},
    choice:{type:String},
    autreProbleme:{type:String},
    name:{type:String},
    age: { type: String},
    clientName: { type: String},
});

const Service = mongoose.model('Service', ServiceSchema);
module.exports = Service;