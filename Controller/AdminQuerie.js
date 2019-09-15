const crypto = require('crypto')

const Admin = require('../Schema/AdminSchema');
const Autre = require('../Schema/AutreSchema');
const User = require('../Schema/UserSchema');
const scrapeIt = require('scrape-it');
let request = require('request');
const VilleCommuneSchema = require('../Schema/VilleCommuneSchema');
const EtablissementSchema = require('../Schema/EtablissementSchema');
const ServiceSchema = require('../Schema/ServiceSchema');
const MedecinSchema = require('../Schema/MedecinSchema');
const Sante = require('../Schema/AssuranceSchema');
const Voyage = require('../Schema/VoyageSchema');
const Habitat = require('../Schema/HabitatSchema');
//https://fr.wikipedia.org/api/rest_v1/page/summary/Abidjan
exports.AdminQuerie = class {
    medical = [
        {
            commune:"Abobo",
            link:"http://www.pagesjaunes.ci/pharmacies-de-garde-abobo/",
        },
        {
            commune:"Adjamé",
            link:"http://www.pagesjaunes.ci/pharmacies-de-garde-adjame/",
        },
        {
            commune:"Anyaba",
            link:"http://www.pagesjaunes.ci/pharmacies-de-garde-abobo/",
        },
        {
            commune:"Abobo",
            link:"http://www.pagesjaunes.ci/pharmacies-de-garde-abobo/",
        },
        {
            commune:"Abobo",
            link:"http://www.pagesjaunes.ci/pharmacies-de-garde-abobo/",
        },
        {
            commune:"Abobo",
            link:"http://www.pagesjaunes.ci/pharmacies-de-garde-abobo/",
        },
    ]
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
            await User.findOneAndUpdate({numero:ele}, {$set:{ "login_date": moment }}, {new: true}).then( res=>{
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
    static setAdmin(ele, pass, name, numberss, etat, clinicName, address, pays){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            let admin = new Admin({name:name,password:newPass, ident:name.substring(0,7)+Math.floor(Math.random()*9999), email:ele, numero:numberss, etat:etat, clinicName:clinicName, address:address, pays:pays});
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
    static ikeaDetails(){
        let base = "https://abidjan.net/inc/abidjan/inc_pharmacie.js";
        return new Promise(async next=>{
            /*scrapeIt(base, {
                title: ".wpb_text_column.wpb_content_element h6 strong",
                pharmacie: {
                    listItem: ".lp-section-content-container.lp-list-page-grid.row .col-md-12.lp-grid-box-contianer.list_view.card1.lp-grid-box-contianer1 "
                    , data: {

                        title: ".lp-grid-box-description .lp-h4"
                        , lien: {
                            selector: ".lp-h4 a"
                            , attr: "href"
                        },
                        address:".text.gaddress"
                    }
                }
            }).then((meta) => {
                console.log(meta)
                base = meta.data;
                next(base);
            }).catch(err=>{
                console.log("err de beta", err);
                next(err);
            });*/
            request({
                uri: base,
                encoding: "latin1",
            }, function (error, response, body) {
                const bod = body.replace(/(\r\n|\n|\r)/gi,"<br />");
                let equal = bod.split('<br />');
                equal.push("finiderochel");
                let ind = -1;
                let ant = 0;
                let block = new Array();
                let inWait = {};
                let item = {};
                item.block = new Array();
                for(let i in equal){
                    if(equal[i].indexOf("boxTitre") !== -1){
                        if(block.length === 0 && ind === -1){
                            ind = i;
                            item.name = equal[i].substring(equal[i].indexOf("&nbsp;")+6,equal[i].length-10)
                            item.block = new Array();
                        }
                        else{
                            ant = 0;
                            block.push(item);
                            item = {};
                            item.name = equal[i].substring(equal[i].indexOf("&nbsp;")+6,equal[i].length-10)
                            item.block = new Array();
                        }
                    }
                    else if (equal[i].indexOf("boxTpharm") !== -1){
                        inWait.title = equal[i].substring(equal[i].indexOf("boxTpharm")+11,equal[i].length-14);
                        inWait.lien = equal[i].substring(equal[i].indexOf("<a href=")+8,equal[i].indexOf("><span"));
                    }
                    else if (equal[i].indexOf("pharmacie.asp?id") !== -1){
                        inWait.img = equal[i].substring(equal[i].indexOf("src=")+4,equal[i].indexOf("></a>"));
                    }
                    else if (equal[i].indexOf("_15.png>") !== -1){
                        inWait.auteur = equal[i].substring(equal[i].indexOf("png>")+4,equal[i].indexOf("<br>"));
                    }
                    else if (equal[i].indexOf("Tel:") !== -1){
                            inWait.numero = equal[i].substring(equal[i].indexOf("Tel:")+4,equal[i].indexOf("<br>"));
                            item.block.push(inWait);

                            inWait = {};
                            ant = -1;
                    }
                    else if(equal[i].indexOf("finiderochel") !== -1){
                        block.push(item);
                            item = {};
                    }
                }
                let title = block[0].name.substring(block[0].name.indexOf("boxTitre")+10,block[0].name.length)
                let focus = block.slice(1,block.length)
                next({error:error, statut:response && response.statusCode, title:title, body:focus}); // Print the error if one occurred
            });
        })
    }

    static ikeaDetailsBrzaz(){
        let base = "http://www.brazzaville.cg/fr/pharmacies";
        return new Promise(async next=>{
            scrapeIt(base, {
                pharmacie: {
                    listItem: '.field-item.even > div'
                    , data: {

                        title: " > div:first-child",
                        address: "div:last-child div:first-child",
                        autor:"div:last-child div:nth-child(2) a",
                        numero:"div:last-child div:last-child",
                    }
                }
            }).then((meta) => {
                console.log(meta)
                base = meta.data;
                next(base);
            }).catch(err=>{
                console.log("err de beta", err);
                next(err);
            });
        }
    )}
    static setUser(pass, name, number,prefix, address,date, sexe){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            let admin = new User({date:date,name:name,password:newPass, ident:name.substring(0,7)+Math.floor(Math.random()*9999), numero:number, address:address, prefix:prefix,sexe:sexe});
            await admin.save().then(res=>{next({etat:true,user:res})}).catch(err=>{console.log(err);next({etat:false})})

        })
    }
    static getAllVille(){
        return new Promise(async next=>{
            await VilleCommuneSchema.find().sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }
    static setVille(name,prefix){
        return new Promise(async next=>{
            let pays = new VilleCommuneSchema({name:name, prefix:prefix});
            await pays.save().then(res=>next(res)).catch(err=>next(err))
        })
    }
    static delHisorique(ident, code){
        return new Promise(async next=>{

        let ville = await User.findOne({ident:ident});
            for(let i in ville.services){
                if(code === ville.services[i].code){
                    ville.services[i].del = 2;
                }
            }
            await ville.save().then(res=>next({etat:true,ville:res})).catch(err=>next({etat:false,error:err}))
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

    static getAllEtablissement(){
        return new Promise(async next=>{
            await EtablissementSchema.find().sort({name:1}).then(res=>next(res)).catch(err=>next(err))
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
    static getCommandewithEtat(level, ServiceName){
        return new Promise(async next=>{
            await ServiceSchema.find({etat:level, serviceName:ServiceName})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }
    static setCommandeAddFirstLevel(code,medecinName, ident){
        let index = 0;
        return new Promise(async next=>{
            await ServiceSchema.findOneAndUpdate({code:code}, {$set:{ "medecin": medecinName, etat:2}}, {new: true}).then( async res=>{
                if(res === null){
                    next({etat:false});
                }else {
                   let updateUser = await User.findOne({ident:ident});
                   for(let i in updateUser.services){
                       if(updateUser.services[i].code === code){
                           index = i;
                           updateUser.services[i].medecin = medecinName;
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
    static setCommandeAddFirstLevelForRDV(code,ClinicName, ident, hour){
        let index = 0;
        return new Promise(async next=>{
            await ServiceSchema.findOneAndUpdate({code:code}, {$set:{ "ClinicName": ClinicName, heure:hour, etat:2}}, {new: true}).then( async res=>{
                if(res === null){
                    next({etat:false});
                }else {
                   let updateUser = await User.findOne({ident:ident});
                   for(let i in updateUser.services){
                       if(updateUser.services[i].code === code){
                           index = i;
                           updateUser.services[i].ClinicName = ClinicName;
                           updateUser.services[i].heure = hour;
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
    static setCommande(ident,name,age,code,serviceName,posAc,Motif,date,commande, autre,choice){
        return new Promise(async next=>{
            let client = await User.findOne({ident:ident});
            if(commande[0] !== undefined) {
                console.log("avec Comande")
                let mini = {
                    code: code,
                    serviceName: serviceName,
                    posAc: posAc,
                    choice:choice,
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
                    next({etat: true, user: ress})
                }).catch(errs => {
                    console.log("service err", errs); next({etat: false})
                })
            }
            else{
                console.log("sans Comande")

                let mini = {
                    code: code,
                    serviceName: serviceName,
                    posAc: posAc,
                    Motif: Motif,
                    date: date,
                    choice:choice,
                    autreProbleme:autre,
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

    static getPaysByPrefix(prefix){
        return new Promise(async next=>{
            await VilleCommuneSchema.findOne({prefix})
                .then(res=>{
                    next(res);
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
    static getAllUsersWithServices(){
        return new Promise(async next=>{
            await User.find()
                .then(res=>{
                    next(res);
                }).catch(err=>{next(err)});
        })
    }
    static getAllMedecin(level){
        return new Promise(async next=>{
            await MedecinSchema.find({level})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static getMedecinByCountrie(pays, specialite){
        const search = '.*'+specialite+'.*';

        return new Promise(async next=>{
            await MedecinSchema.find({$and:[{pays:pays},{"specialite":{'$regex': search}}]})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static getEtablissementByCountrie(pays, specialite){
        let block = [];
        return new Promise(async next=>{
            await EtablissementSchema.find({pays:pays})
                .then(res=>{
                    for(let i in res){
                        for(let j in res[i].specialite){
                            if(specialite === res[i].specialite[j].name){
                                block.push(res[i]);
                            }
                            continue;
                        }
                        continue;
                    }
                    next(block);
                }).catch(err=>{next(err)});
        })
    }
    static setMedecin(name, numero,clinic,address,specialite, pays, level,image){
        return new Promise(async next=>{
            let medecin = new MedecinSchema({name:name,numero:numero,clinic:clinic,address:address,specialite:specialite, pays, level,image})
            await medecin.save().then(res=>next(res)).catch(err=>next(err))
        })
    }

    static setEtablissementRef(name, nameRespo,fonction,email,numero, numeroSecond, localisation,complementaire, pays, address, field, file){
        
        let spec = [];
        for (let i in field){
            spec.push({name:field[i]});
            continue;
        }
        return new Promise(async next=>{
            let medecin = new EtablissementSchema({name:name,nameResponsable:nameRespo,fonctionResponsable:fonction,contactUn:numero,contactDeux:numeroSecond,situationGeographique:localisation,ville:address,email:email,pays:pays,complementaire:complementaire,image:file,specialite:spec})
            await medecin.save().then(res=>next(res)).catch(err=>next(err))
        })
    }




    static getAssuranceHabitat(){
        return new Promise(async next=>{
            await Habitat.find()
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static getAssuranceVoyage(){
        return new Promise(async next=>{
            await Voyage.find()
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }



    static getAssuranceSante(){
        return new Promise(async next=>{
            await Sante.find()
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static setAssuranceSante(name, numero, nameUsage, address, birthDate, firstname, sexe, email, numeroS){
        return new Promise(async next=>{
            let medecin = new Sante({name:name,numero:numero,nameUsage:nameUsage,address:address,birthDate:birthDate, firstname:firstname, sexe:sexe, email:email, numeroS:numeroS})
            await medecin.save().then(res=>next({etat:true, resultat:res})).catch(err=>next({etat:false, err:err}))
        })
    }
    static setAssuranceVoyage(name, numero,origine,destination, birthDate, firstname, sexe, changeNumberDeJours){
        return new Promise(async next=>{
            let medecin = new Voyage({name:name,address:numero,paysOr:origine,paysDest:destination,birthDate:birthDate, firstname:firstname, sexe:sexe, changeNumberDeJours:changeNumberDeJours})
            await medecin.save().then(res=>next({etat:true, resultat:res})).catch(err=>next({etat:false, err:err}))
        })
    }
}