let config = require('../Setting/config');
let VilleCommuneSchema = require('../Schema/VilleCommuneSchema');
let AdminSchema = require('../Schema/AdminSchema');
let mongoose = require('mongoose');

//Connextion avec mongo
let connect = async ()=>{
    try {
        await mongoose.connect(config.db.url, {
            useNewUrlParser: true,
            useFindAndModify: config.db.useFindAndModify
        });
        console.log(">>>> Database Connected");
    }
    catch (e) {
        console.log(e.toString())
    }
}
module.exports =  connect
