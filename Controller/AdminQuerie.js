const crypto = require('crypto')

const Admin = require('../Schema/AdminSchema');
const Autre = require('../Schema/AutreSchema');
const User = require('../Schema/UserSchema');
const VilleCommuneSchema = require('../Schema/VilleCommuneSchema');
const ServiceSchema = require('../Schema/ServiceSchema');
const MedecinSchema = require('../Schema/MedecinSchema');

exports.AdminQuerie = class {
    static getVerifyAdmin(ele, pass){
        const moment = new Date();
        return new Promise(async next=>{
            await Admin.findOneAndUpdate({name:ele}, {$set:{ "login_date": moment }}, {new: true}).then( res=>{
                if(res === null){
                    next({etat:false});
                }else {
                    if(res.password === crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')){
                        next({etat:true, user:res});
                    }
                    else {
                        next({etat:false});
                    }
                }
            }).catch(err=>next({etat:false}))
        })
    }
    static getVerifyUser(ele, pass){
        const moment = new Date();
        return new Promise(async next=>{
            await User.findOneAndUpdate({email:ele}, {$set:{ "login_date": moment }}, {new: true}).then( res=>{
                if(res === null){
                    next({etat:false});
                }else {
                    if(res.password === crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')){
                        next({etat:true, user:res});
                    }
                    else {
                        next({etat:false});
                    }
                }
            }).catch(err=>next({etat:false}))
        })
    }
    static setAdmin(ele, pass, name, numberss, etat, clinicName, address){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            let admin = new Admin({name:name,password:newPass, ident:name.substring(0,7)+Math.floor(Math.random()*9999), email:ele, numero:numberss, etat:etat, clinicName:clinicName, address:address});
            await admin.save().then(res=>next({etat:true})).catch(err=>{console.log("erre", err); next({etat:false}) })
        })
    }
    static setAutre(name, level){
        return new Promise(async next=>{
            let admin = new Autre({name:name, level:level});
            await admin.save().then(res=>next({etat:true})).catch(err=>{console.log("erre", err); next({etat:false}) })
        })
    }
    static getAdmin(){
        return new Promise(async next=>{
            await Admin.find({etat:2}).sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }
    static setUser(ele, pass, name, number, address,date){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            let admin = new User({date:date,name:name,password:newPass, ident:name.substring(0,7)+Math.floor(Math.random()*9999), email:ele, numero:number, address:address});
            await admin.save().then(res=>{next({etat:true,user:res})}).catch(err=>{console.log(err);next({etat:false})})

        })
    }
    static getAllVille(){
        return new Promise(async next=>{
            await VilleCommuneSchema.find().sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }
    static getAllAutre(level){
        return new Promise(async next=>{
            await Autre.find({level:level}).sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }
    static getAllAdmin(){
        return new Promise(async next=>{
            await Admin.find().sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }
    static setVille(name){
        return new Promise(async next=>{
            let ville = new VilleCommuneSchema({name:name});
            await ville.save().then(res=>next({etat:true,ville:res})).catch(err=>next({etat:false,error:err}))

        })
    }
    static AddCommune(nameVile, nameCommune){
        return new Promise(async next=>{
            let ville = await VilleCommuneSchema.findOne({name:nameVile});
            ville.commune.push({nameCommune:nameCommune})
            await ville.save().then(res=>next({etat:true,ville:res})).catch(err=>next({etat:false,error:err}))
        })
    }
    static getCommandeInWait(text){
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{etat:1}, {serviceName:text}]})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
           })
    }
    static getCommandeTotal(text){
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{etat:3}, {serviceName:text}]})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }
    static getCommandewithEtat(level){
        return new Promise(async next=>{
            await ServiceSchema.find({etat:level})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }
    static setCommandeAddFirstLevel(code,medecinName,clinicName, ident){
        let index = 0;
        return new Promise(async next=>{
            await ServiceSchema.findOneAndUpdate({code:code}, {$set:{ "medecin": medecinName, ClinicName:clinicName, etat:2}}, {new: true}).then( async res=>{
                if(res === null){
                    next({etat:false});
                }else {
                   let updateUser = await User.findOne({ident:ident});
                   for(let i in updateUser.services){
                       if(updateUser.services[i].code === code){
                           index = i;
                           updateUser.services[i].medecin = medecinName;
                           updateUser.services[i].ClinicName = clinicName;
                           updateUser.services[i].etat = 2;
                           break;
                       }
                   }
                   updateUser.save().then(ress=>{next({etat:true,user:ress, index:index,provider:res})}).catch(errr=>{console.log(errr); next({etat:false})})
                    /*if(res.password === crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')){
                        next({etat:true, user:res});
                    }
                    else {
                        next({etat:false});
                    }*/
                }
            }).catch(err=>next({etat:false}))
        })
    }

    static setCommandeFinal(code, ident){
        let index = 0;
        return new Promise(async next=>{
            await ServiceSchema.findOneAndUpdate({code:code}, {$set:{ etat:3}}, {new: true}).then( async res=>{
                if(res === null){
                    next({etat:false});
                }else {
                    let updateUser = await User.findOne({ident:ident});
                    for(let i in updateUser.services){
                        if(updateUser.services[i].code === code){
                            index = i;
                            updateUser.services[i].etat = 3;
                            break;
                        }
                    }
                    updateUser.save().then(ress=>{ next({etat:true,user:ress, index:index})}).catch(errr=>{console.log(errr); next({etat:false})})
                    /*if(res.password === crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')){
                        next({etat:true, user:res});
                    }
                    else {
                        next({etat:false});
                    }*/
                }
            }).catch(err=>next({etat:false}))
        })
    }
    static setCommande(ident,name,age,code,serviceName,posAc,Motif,date,commande, autre){
        return new Promise(async next=>{
            let client = await User.findOne({ident:ident});
            if(commande[0] !== undefined) {
                let mini = {
                    code: code,
                    serviceName: serviceName,
                    posAc: posAc,
                    autreProbleme:autre,
                    Motif: Motif,
                    date: date,
                    commande: commande
                }
                client.services.push(mini);
                await client.save().then(res => console.log("client save avec new")).catch(err => console.log("client save avec err", err))
                mini.ident = ident;
                mini.name = name;
                mini.age = age;
                mini.clientName = client.name;
                let service = new ServiceSchema(mini);
                await service.save().then(ress => {
                    cnext({etat: true, user: ress})
                }).catch(errs => {
                    console.log("service err", errs), next({etat: false})
                })
            }
            else{
                let mini = {
                    code: code,
                    serviceName: serviceName,
                    posAc: posAc,
                    Motif: Motif,
                    date: date,
                }
                client.services.push(mini);
                await client.save().then(res => console.log("client save avec new")).catch(err => console.log("client save avec err", err))
                mini.ident = ident;
                mini.name = name;
                mini.age = age;
                mini.clientName = client.name;
                let service = new ServiceSchema(mini);
                await service.save().then(ress => {
                    next({etat: true, user: ress})
                }).catch(errs => {
                    console.log("service err", errs), next({etat: false})
                })
            }
            })
    }
    static getUserByIdent(ident){
        return new Promise(async next=>{
            await User.findOne({ident:ident})
                .then(res=>{
                    if(res === null){
                        next({etat:false})
                    }
                    else{
                        next({etat:true, user:res});
                    }
                }).catch(err=>{next(err)});
        })
    }
    static getAllServiceInToday(name){
        var moment = new Date().getFullYear() + "-"+(new Date().getMonth()+1)+ "-"+new Date().getDate();
        console.log(moment);
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{ClinicName:name,date:{$gte:new Date(moment).toISOString(), $lte:  new Date(moment).toISOString() }}]}).then(res=>{
                console.log("total",res.length);
                next(res);
            }).catch(err=>{console.log("err ",err);next(err)});
        })
    }
    static getAllServiceInBecame(name){
        var moment = new Date().getFullYear() + "-"+(new Date().getMonth()+1)+ "-"+new Date().getDate();
        console.log(moment);
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{ClinicName:name,date:{$gte: new Date(moment).toISOString()}}]}).then(res=>{
                console.log("total",res.length);
                next(res);
            }).catch(err=>next(err));
        })
    }
    static updateUser(ele, pass, number, address,ident){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
           await User.findOneAndUpdate({$and:[{ident:ident,password:newPass}]}, {$set:{ "email": ele,"numero":number,"address":address }}, {new: true}).then(ress=>{
               next({etat:true,user:ress})
           }).catch(err=>next({etat:false,err:err}))
        })
    }
    static updateAdmin(pass, newPass,ident){
        const Pass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex');
        const NEWPass = crypto.createHmac("SHA256", newPass).update("Yabana, An other NaN").digest('hex');
        console.log(Pass);
        return new Promise(async next=>{
            await Admin.findOneAndUpdate({$and:[{ident:ident,password:Pass}]}, {$set:{ "password": newPass}}, {new: true}).then(ress=>{

                next({etat:true,user:ress})
            }).catch(err=>next({etat:false,err:err}))
        })
    }
    static getAllUser(){
        return new Promise(async next=>{
            await User.count()
                .then(res=>{
                    next(res);
                }).catch(err=>{next(err)});
        })
    }
    static getAllMedecin(){
        return new Promise(async next=>{
            await MedecinSchema.find()
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }
    static setMedecin(name, numero,clinic,address,specialite){
        return new Promise(async next=>{
            let medecin = new MedecinSchema({name:name,numero:numero,clinic:clinic,address:address,specialite:specialite})
            await medecin.save().then(res=>next(res)).catch(err=>next(err))
        })
    }
}