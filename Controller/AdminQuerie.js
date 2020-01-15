const crypto = require('crypto')

const Admin = require('../Schema/AdminSchema');
const Autre = require('../Schema/AutreSchema');
const AsprofSchema = require('../Schema/AsprofSchema');
const User = require('../Schema/UserSchema');
const scrapeIt = require('scrape-it');
let request = require('request');
const VilleCommuneSchema = require('../Schema/VilleCommuneSchema');
const EtablissementSchema = require('../Schema/EtablissementSchema');
const Medoc = require('../Schema/Medoc');
const Auto = require('../Schema/Auto');
const Moto = require('../Schema/Moto');
const ServiceSchema = require('../Schema/ServiceSchema');
const MedecinSchema = require('../Schema/MedecinSchema');
const Sante = require('../Schema/AssuranceSchema');
const Voyage = require('../Schema/VoyageSchema');
const Habitat = require('../Schema/HabitatSchema');
//https://fr.wikipedia.org/api/rest_v1/page/summary/Abidjan

exports.AdminQuerie = class {

    static delMedecin(code){
        return new Promise(async (next)=>{
            await MedecinSchema.findOneAndDelete({code:code})
                .then(async res=>{
                    next(res)
                }).catch(err=>{ next(err)});
        })
    }

    static delMedoc(recovery){
        return new Promise(async (next)=>{
            await Medoc.findOneAndDelete({recovery:recovery})
                .then(async res=>{
                    next(res)
                }).catch(err=>{ next(err)});
        })
    }

    static delAdmin(ident){
        return new Promise(async (next)=>{
            await Admin.findOneAndDelete({ident:ident})
                .then(async res=>{
                    next(res)
                }).catch(err=>{ next(err)});
        })
    }

    static delEtablissement(name){
        return new Promise(async (next)=>{
            await EtablissementSchema.findOneAndDelete({code:parseInt(name,10)})
                .then(async res=>{
                    next(res)
                }).catch(err=>{ next(err)});
        })
    }

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

    static updatePasswordUser(ident, pass, code){
        const pas = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            await User.findOneAndUpdate({$and:[{ident:ident}, {recovery:parseInt(code,10)}]}, {$set:{ "password": pas, recovery:Math.floor(Math.random()*9999) }}, {new: true}).then( res=>{
                if(res === null){
                    next({etat:false});
                }else {
                    next({etat:true, user:res});
                }
            }).catch(err=>next({etat:false}))
        })
    }
    static updatePasswordClient(ident, pass, code){
        const pas = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        const co = crypto.createHmac("SHA256", code).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            await User.findOneAndUpdate({$and:[{ident:ident}, {password:pas}]}, {$set:{ "password": co }}, {new: true}).then( res=>{
                if(res === null){
                    next({etat:false});
                }else {
                    next({etat:true, user:res});
                }
            }).catch(err=>next({etat:false}))
        })
    }
    static setAdmin(ele, pass, name, numberss, etat, clinicName, address, pays, nameResponsable,fonctionResponsable, field, tarr){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex');
        let spec = [];
        let specs = [];
        for (let i in field){
            spec.push({name:field[i]});
            specs.push({name:tarr[i]});
            continue;
        }
        return new Promise(async next=>{
            let admin = new Admin({name:name,password:newPass, ident:name.substring(0,7)+Math.floor(Math.random()*9999), email:ele, numero:numberss, etat:etat, clinicName:clinicName, address:address, pays:pays,nameResponsable, fonctionResponsable,specialite:spec,tarif:specs});
            await admin.save().then(res=>next({etat:true})).catch(err=>{ next({etat:false}) })
        })
    }

    static updateAdmins(ident,ele, name, numberss, etat, clinicName, address, pays, nameResponsable,fonctionResponsable, field, tarr){
        let spec = [];
        let specs = [];
        for (let i in field){
            spec.push({name:field[i]});
            specs.push({name:tarr[i]});
            continue;
        }
        const drake = {name:name, email:ele, numero:numberss, etat:etat, clinicName:clinicName, address:address, pays:pays,nameResponsable, fonctionResponsable,specialite:spec,tarif:specs};
        return new Promise(async next=>{
            await Admin.findOneAndUpdate({ident:ident}, {$set:drake}, {new:true}).then(res=>{
                
                next(res);
            }).catch(err=>{ next(err)});
        })
    }
    static setAutre(name, level){
        return new Promise(async next=>{
            let admin = new Autre({name:name, level:level});
            await admin.save().then(res=>next({etat:true})).catch(err=>{ next({etat:false}) })
        })
    }
    static getAdmin(){
        return new Promise(async next=>{
            await Admin.find({etat:2}).sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }

    static meteo(lagitude,longitude, local){
        let base = `https://api.weather.com/v3/wx/forecast/daily/3day?apiKey=6532d6454b8aa370768e63d6ba5a832e&geocode=${lagitude}%2C${longitude}&units=e&language=${local}&format=json`;
        return new Promise(async next=>{
            request({
                uri: base,
            }, (error, response, body) => {
                var data = [];
                if(!error){
                    body = JSON.parse(body);
                    body.dayOfWeek.forEach((element, i) => {
                        let info = {};
                        info.day = element;
                        info.phaseDeLune = body.moonPhase[i];
                        info.periodMoreTempOfDay = body.moonsetTimeLocal[i];
                        info.narrative = body.narrative[i];
                        info.temperatureMax = body.temperatureMax[i];
                        info.temperatureMin = body.temperatureMin[i];
                        info.sunRise = body.sunriseTimeLocal[i];
                        info.sunSet = body.sunsetTimeLocal[i];
                        switch(i){
                            case 0:
                                info.temperature = {
                                    matin:{
                                        celcus:Math.ceil((body.daypart[0].temperature[0]-32)*(5/9)),
                                        farat:body.daypart[0].temperature[0],
                                        narrative:body.daypart[0].narrative[0],
                                        wind:parseInt(body.daypart[0].windSpeed[0] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[0]+')',
                                    },
                                    soir:{
                                        celcus:Math.ceil((body.daypart[0].temperature[1]-32)*(5/9)),
                                        farat:body.daypart[0].temperature[1],
                                        narrative:body.daypart[0].narrative[1],
                                        wind:parseInt(body.daypart[0].windSpeed[1] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[1]+')'
                                    }
                                }
                                break;
                            case 1:
                                    info.temperature = {
                                        matin:{
                                            celcus:Math.ceil((body.daypart[0].temperature[2]-32)*(5/9)),
                                            farat:body.daypart[0].temperature[2],
                                            narrative:body.daypart[0].narrative[2],
                                            wind:parseInt(body.daypart[0].windSpeed[2] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[2]+')',
                                        },
                                        soir:{
                                            celcus:Math.ceil((body.daypart[0].temperature[3]-32)*(5/9)),
                                            farat:body.daypart[0].temperature[3],
                                            narrative:body.daypart[0].narrative[3],
                                            wind:parseInt(body.daypart[0].windSpeed[3] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[3]+')'
                                        }
                                    }
                                    break;
                            case 2:
                                    info.temperature = {
                                        matin:{
                                            celcus:Math.ceil((body.daypart[0].temperature[4]-32)*(5/9)),
                                            farat:body.daypart[0].temperature[4],
                                            narrative:body.daypart[0].narrative[4],
                                            wind:parseInt(body.daypart[0].windSpeed[4] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[4]+')',
                                        },
                                        soir:{
                                            celcus:Math.ceil((body.daypart[0].temperature[5]-32)*(5/9)),
                                            farat:body.daypart[0].temperature[5],
                                            narrative:body.daypart[0].narrative[5],
                                            wind:parseInt(body.daypart[0].windSpeed[5] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[5]+')'
                                        }
                                    }
                                break;
                            case 3:
                                    info.temperature = {
                                        matin:{
                                            celcus:Math.ceil((body.daypart[0].temperature[6]-32)*(5/9)),
                                            farat:body.daypart[0].temperature[6],
                                            narrative:body.daypart[0].narrative[6],
                                            wind:parseInt(body.daypart[0].windSpeed[6] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[6]+')',
                                        },
                                        soir:{
                                            celcus:Math.ceil((body.daypart[0].temperature[7]-32)*(5/9)),
                                            farat:body.daypart[0].temperature[7],
                                            narrative:body.daypart[0].narrative[7],
                                            wind:parseInt(body.daypart[0].windSpeed[7] - 1, 10)+' m/h,  ('+body.daypart[0].windDirection[7]+')'
                                        }
                                    }
                                break;
                            default:
                                console.log('Fin');
                                break;
                        }
                        data.push(info);
                    });
                    next({error:false, statut:response && response.statusCode, body:data});
                }
                 else   next({error:error, statut:response && response.statusCode, body:data}); // Print the error if one occurred
            });
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
                            inWait.numero = (inWait.numero)? inWait.numero + ' / '+equal[i].substring(equal[i].indexOf("Tel:")+4,equal[i].indexOf("<br>")):equal[i].substring(equal[i].indexOf("Tel:")+4,equal[i].indexOf("<br>"));
                    }
                    else if (equal[i].indexOf("</h4>") !== -1){
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
                base = meta.data;
                next(base);
            }).catch(err=>{
                
                next(err);
            });
        }
    )}

    static ouaga(){
        let base = "https://ayeler.com/fr/sites-ec/term/61";
        return new Promise(async next=>{
            scrapeIt(base, {
                pharmacie: {
                    listItem: '.views-table.cols-0 tr'
                    , data: {

                        title:{
                            selector: "td a",
                             how: "text"
                            },
                        numero: {
                            selector:"td",
                            how: "text"
                        },
                        addressBP:"td .thoroughfare",
                        address:"td .premise"
                    }
                }
            }).then((meta) => {
                base = meta.data.pharmacie.map((value)=>{
                    const num = value.numero.substring(value.numero.indexOf("(226)"),value.numero.length);
                    return {
                        title:value.title,
                        addressBP:value.addressBP,
                        address:value.address,
                        numero:num
                    }
                });
                next({pharmacie:base});
            }).catch(err=>{
                
                next(err);
            });
        }
    )}
    static paris(){
        let base = "https://www.parisinfo.com/decouvrir-paris/guides-thematiques/paris-la-nuit/carnet-pratique-du-noctambule/ouvert-tres-tard-ou-toute-la-nuit/les-pharmacies-de-nuit?perPage=50&sort=alpha_asc";
        return new Promise(async next=>{
            scrapeIt(base, {
                pharmacie: {
                    listItem: '.Article-line-list article'
                    , data: {

                        title:{
                            selector: ".Article-line-title a",
                             how: "text"
                            },
                        
                        address:".Article-line-place"
                    }
                }
            }).then((meta) => {
                base = meta.data
                next(base);
            }).catch(err=>{
                
                next(err);
            });
        }
    )}

    static yaounde(){
        let base = "https://www.annuaire-medical.cm/fr/pharmacies-de-garde/centre/yaounde";
        return new Promise(async next=>{
            scrapeIt(base, {
                titles: "div.category-desc p",
                pharmacie: {
                    listItem: '.items-leading > div'
                    , data: {

                        address:{
                            selector: ".pharma_line",
                             how: "text"
                            },
                        
                        title:".pharma_line strong",
                        numero:".pharma_line span",
                    }
                }
            }).then((meta) => {
                base = meta.data.pharmacie.map((value)=>{
                    const num = value.address.substring(value.address.indexOf(":") + 2,value.address.length);
                    return {
                        title:value.title,
                        address:num,
                        numero:value.numero
                    }
                });
                next({title:meta.data.titles, pharmacie:base});
            }).catch(err=>{
                
                next(err);
            });
        }
    )}
    static setUser(pass, name, number,prefix, address,date, sexe, email){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
            let admin = new User({date:date,name:name,password:newPass, ident:name.substring(0,7)+Math.floor(Math.random()*9999), numero:number, address:address, prefix:prefix,sexe:sexe, email:email, recovery:Math.floor(Math.random()*9999)});
            await admin.save().then(res=>{next({etat:true,user:res})}).catch(err=>{next({etat:false})})

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
    static delAutre(name){
        return new Promise(async (next)=>{
            await Autre.findOneAndDelete({name:name})
                .then(async res=>{
                    next(res)
                }).catch(err=>{ next(err)});
        })
    }

    static delVille(prefix){
        return new Promise(async (next)=>{
            await VilleCommuneSchema.findOneAndDelete({prefix:prefix})
                .then(async res=>{
                    next(res)
                }).catch(err=>{ next(err)});
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
            await ville.save().then(res=>{
                console.log(res)
                next({etat:true,ville:res})
            }).catch(err=>{
                console.log(err)
                next({etat:false,error:err})})
    })
}
    static getAllAutre(level){
        return new Promise(async next=>{
            await Autre.find({level:level}).sort({name:1}).then(res=>next(res)).catch(err=>next(err))
        })
    }
    static getAllAdmin(){
        return new Promise(async next=>{
            await Admin.find({etat:1}).sort({name:1}).then(res=>next(res)).catch(err=>next(err))
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
    static getEtablissementByName(name){
        return new Promise(async next=>{
            await Admin.findOne({clinicName:name})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }
    static getMedecinByName(name){
        return new Promise(async next=>{
            await MedecinSchema.findOne({name:name})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static getAssuranceByRecovery(recovery){
        return new Promise(async next=>{
            await Sante.findOne({recovery:recovery})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static updateAssuranceByRecovery(recovery){
        return new Promise(async next=>{
            await Sante.findOneAndUpdate({recovery:parseInt(recovery,10)}, {$set:{etat:2}})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static updateMedocByRecovery(recovery){
        return new Promise(async next=>{
            await Medoc.findOneAndUpdate({recovery:parseInt(recovery,10)}, {$set:{etat:2}})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }
    static updateProfessionnelByRecovery(recovery){
        return new Promise(async next=>{
            await AsprofSchema.findOneAndUpdate({recovery:parseInt(recovery,10)}, {$set:{etat:2}})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }
    static updateAutoByRecovery(recovery){
        return new Promise(async next=>{
            await Auto.findOneAndUpdate({recovery:parseInt(recovery,10)}, {$set:{etat:2}})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static updateMotoByRecovery(recovery){
        return new Promise(async next=>{
            await Moto.findOneAndUpdate({recovery:parseInt(recovery,10)}, {$set:{etat:2}})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static getAssuranceVoyageByRecovery(recovery){
        return new Promise(async next=>{
            await Voyage.findOne({recovery:recovery})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }
    static getAssuranceProfesssionelByRecovery(recovery){
        return new Promise(async next=>{
            await AsprofSchema.findOne({recovery:recovery})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static getAssuranceAutoByRecovery(recovery){
        return new Promise(async next=>{
            await Auto.findOne({recovery:recovery})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }
    
    static getAssuranceMotoByRecovery(recovery){
        return new Promise(async next=>{
            await Moto.findOne({recovery:recovery})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static updateAssuranceVoyageByRecovery(recovery){
        return new Promise(async next=>{
            await Voyage.findOneAndUpdate({recovery:parseInt(recovery,10)}, {$set:{etat:2}})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static getAssuranceProfByRecovery(recovery){
        return new Promise(async next=>{
            await AsprofSchema.findOne({recovery:recovery})
            .then(res=>next(res)).catch(err=>next(err))
        })
    }

    static getServiceByClinicNameAndCode(clinicName, code){
        return new Promise(async next=>{
            await ServiceSchema.findOne({ClinicName:clinicName, code:code, etat:2})
            .then(res=>next(res)).catch(err=>next(err))
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
                   updateUser.save().then(ress=>{next({etat:true,user:ress, index:index,provider:res})}).catch(errr=>{ next({etat:false})})
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
    static setServiceFinale(code){
        return new Promise(async next=>{
            await ServiceSchema.findOneAndUpdate({code:code}, {$set:{etat:3}}, {new: true}).then( res=>{
                next({etat:true, user:res})
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
                   updateUser.save().then(ress=>{next({etat:true,user:ress, index:index,provider:res})}).catch(errr=>{ next({etat:false})})
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
                    updateUser.save().then(ress=>{ next({etat:true,user:ress, index:index})}).catch(errr=>{ next({etat:false})})
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
                     next({etat: false})
                })
            }
            else{

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
                     next({etat: false})
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
    static getUserByNumber(numero){
        return new Promise(async next=>{
            await User.findOne({numero:numero})
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
        
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{ClinicName:name,date:{$gte:new Date(moment).toISOString(), $lte:  new Date(moment).toISOString() }}]}).then(res=>{
                next(res);
            }).catch(err=>{next(err)});
        })
    }
    static getAllClientByClinicName(name){
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{ClinicName:name,etat:{$gte: 2}}]}).then(res=>{
                next(res);
            }).catch(err=>next(err));
        })
    }
    static getAllServiceInBecame(name){
        var moment = new Date().getFullYear() + "-"+(new Date().getMonth()+1)+ "-"+new Date().getDate();
        
        return new Promise(async next=>{
            await ServiceSchema.find({$and:[{ClinicName:name,date:{$gte: new Date(moment).toISOString()}}]}).then(res=>{
                next(res);
            }).catch(err=>next(err));
        })
    }
    static updateUser(ele, pass, number, address,ident,name,date,profil){
        const newPass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex')
        return new Promise(async next=>{
           await User.findOneAndUpdate({$and:[{ident:ident,password:newPass}]}, {$set:{ "email": ele,"numero":number,"address":address,name:name,date:date,profil:profil }}, {new: true}).then(ress=>{
               next({etat:true,user:ress})
           }).catch(err=>next({etat:false,err:err}))
        })
    }
    static updateUserPhotoOnly(photo,ident){
        return new Promise(async next=>{
           await User.findOneAndUpdate({ident:ident}, {$set:{profil:photo}}, {new: true}).then(ress=>{
               next({etat:true,user:ress})
           }).catch(err=>next({etat:false,err:err}))
        })
    }
    static updateAdmin(pass, newPass,ident){
        const Pass = crypto.createHmac("SHA256", pass).update("Yabana, An other NaN").digest('hex');
        const NEWPass = crypto.createHmac("SHA256", newPass).update("Yabana, An other NaN").digest('hex');
        
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
            await MedecinSchema.find({level:level}).sort({name:-1})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }


    static getMedecinByCountrie(pays, specialite){
        const search = '.*'+specialite+'.*';

        return new Promise(async next=>{
            await MedecinSchema.find({$and:[{pays:pays},{level:1},{$or:[{"name":{'$regex': search}},{"specialite":{'$regex': search}}]}]})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static getMedecinByCountrieTrue(pays){

        return new Promise(async next=>{
            await MedecinSchema.find({$and:[{pays:pays},{level:1}]})
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static getEtablissementByCountrie(pays, specialite){
        const search = '.*'+specialite+'.*';
        return new Promise(async next=>{
            await EtablissementSchema.find({$and:[{pays:pays},,{level:1},{$or:[{"name":{'$regex': search}},{"spec":{'$regex': search}}]}]})
            .then(res=>{
                
                next(res)
            }).catch(err=>{next(err)});
        })
    }
    static getEtablissementByCountrieTrue(pays){
        return new Promise(async next=>{
            await EtablissementSchema.find({pays:pays})
            .then(res=>{
                
                next(res)
            }).catch(err=>{next(err)});
        })
    }
    static setMedecin(name, numero,clinic,address,specialite, pays, level,image, email, numeroSe,ouverture, fermerture, onm, moyenDePayement, tarif,remboursement, codePostale){
        const beta = Math.floor(Math.random()*99999)
        return new Promise(async next=>{
            let medecin = new MedecinSchema({code:beta,name:name,numero:numero,clinic:clinic,address:address,specialite:specialite.toLowerCase(), pays, level,image,email,numeroSe:numeroSe, ouverture,fermerture,onm,moyenDePayement,tarif,remboursement, codePostale})
            await medecin.save().then(res=>{ next(res)}).catch(err=>{ next(err)})
        })
    }

    static updateMedecin(id,name, numero,clinic,address,specialite, pays, level,image, email, numeroSe,ouverture, fermerture, onm, moyenDePayement, tarif,remboursement, codePostale){
        return new Promise(async next=>{
            await MedecinSchema.findOneAndUpdate({code:parseInt(id,10)}, {$set:{name:name,numero:numero,clinic:clinic,address:address,specialite:specialite.toLowerCase(), pays, level,image,email,numeroSe:numeroSe, ouverture,fermerture,onm,moyenDePayement,tarif,remboursement, codePostale}}, {new:true}).then(res=>{
                
                next(res);
            }).catch(err=>{ next(err)});
        })
    }

    static setEtablissementRef(name, nameRespo,fonction,email,numero, numeroSecond, localisation,complementaire, pays, address, field, file,tarif,ouverture, fermerture, remboursement){
        const beta = Math.floor(Math.random()*99999)
        let spec = [];
        let specs = [];
        for (let i in field){
            spec.push({name:field[i]});
            specs.push({name:tarif[i]});
            continue;
        }
        field = (typeof field === "string") ? field.split(''): field;
        return new Promise(async next=>{
            let medecin = new EtablissementSchema({code:beta,name:name,nameResponsable:nameRespo,fonctionResponsable:fonction,contactUn:numero,contactDeux:numeroSecond,situationGeographique:localisation,ville:address,email:email,pays:pays,complementaire:complementaire,image:file,specialite:spec, ouverture,fermerture,tarif:specs,remboursement, spec:field.join('').toLowerCase()})
            await medecin.save().then(res=>next(res)).catch(err=>{ next(err)})
        })
    }

    static updateEtablissementRef(id,name, nameRespo,fonction,email,numero, numeroSecond, localisation,complementaire, pays, address, field, file,tarif,ouverture, fermerture, remboursement){
        let spec = [];
        let specs = [];
        for (let i in field){
            spec.push({name:field[i]});
            specs.push({name:tarif[i]});
            continue;
        }

        var drake = {name:name,nameResponsable:nameRespo,fonctionResponsable:fonction,contactUn:numero,contactDeux:numeroSecond,situationGeographique:localisation,ville:address,email:email,pays:pays,complementaire:complementaire,image:file,specialite:spec, ouverture,fermerture,tarif:specs,remboursement, spec:field.join('').toLowerCase()}
        return new Promise(async next=>{
            await EtablissementSchema.findOneAndUpdate({code:parseInt(id,10)}, {$set:drake}, {new:true}).then(res=>{
                next(res);
            }).catch(err=>{ next(err)});
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
    static getMedoc(){
        return new Promise(async next=>{
            await Medoc.find().sort({name:1})
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
    static getAssuranceAuto(){
        return new Promise(async next=>{
            await Auto.find()
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static getAssuranceMoto(){
        return new Promise(async next=>{
            await Moto.find()
                .then(res=>{
                    next(res)
                }).catch(err=>{next(err)});
        })
    }

    static setAssuranceSante(name, numero, nameUsage, address, birthDate, firstname, sexe, email, numeroS){
    
        const leta = Math.floor(Math.random()*9999);
        return new Promise(async next=>{
            let medecin = new Sante({name:name,numero:numero,nameUsage:nameUsage,address:address,birthDate:birthDate, firstname:firstname, sexe:sexe, email:email, numeroS:numeroS, recovery:leta})
            await medecin.save().then(res=>next({etat:true, resultat:res})).catch(err=>next({etat:false, err:err}))
        })
    }

    static setMedoc(name,price, ordonnance, familie){
    
        const leta = Math.floor(Math.random()*9999);
        return new Promise(async next=>{
            let medecin = new Medoc({name:name,price:price,ordonnance:ordonnance,familie:familie, recovery:leta})
            await medecin.save().then(res=>next({etat:true, resultat:res})).catch(err=>next({etat:false, err:err}))
        })
    }

    static updateMedoc(old, name,price, ordonnance, familie){

        const drake = {name, price, ordonnance, familie};
        return new Promise(async next=>{
            await Medoc.findOneAndUpdate({recovery:parseInt(old,10)}, {$set:drake}, {new:true}).then(res=>{
                
                next(res);
            }).catch(err=>{ next(err)});
        })
    }
    static setAssuranceAuto(data){
        const {name,numero, durrerContrat,address,immatriculation,firstname,sexe,email,typeCarte,profession,nationnalite,effetContrat,marque,genre,chasis,puissanceVehicule,energie,nombreDePlace,nombreDePassager,cassorie,pv,ptac,cu,garantie,profil} = data;
        const leta = Math.floor(Math.random()*9999);
        return new Promise(async next=>{
            let medecin = new Auto({name,numero, durrerContrat,address,immatriculation,firstname,sexe,email,typeCarte,profession,nationnalite,effetContrat,marque,genre,chasis,puissanceVehicule,energie,nombreDePlace,nombreDePassager,cassorie,pv,ptac,cu,garantie,profil,recovery:leta})
            await medecin.save().then(res=>{/* */ next({etat:true, resultat:res})}).catch(err=>{ next({etat:false, err:err})})
        })
    }

    static setAssuranceMoto(data){
        const {name,numero, durrerContrat,address,immatriculation, firstname,sexe,email,typeCarte,profession,nationnalite,effetContrat,marque,genre,chasis,puissanceVehicule,energie,nombreDePlace,garantie,profil,numeroSe,premierImmatriculation} = data;
        const leta = Math.floor(Math.random()*9999);
        return new Promise(async next=>{
            let medecin = new Moto({name,numero, durrerContrat,address,immatriculation, premierImmatriculation, firstname,sexe,email,typeCarte,profession,nationnalite,effetContrat,marque,genre,chasis,puissanceVehicule,energie,nombreDePlace,garantie,profil,numeroSe,recovery:leta})
            await medecin.save().then(res=>next({etat:true, resultat:res})).catch(err=>next({etat:false, err:err}))
        })
    }

    static setAssurancePro(name, numero, address, email, genre){
    
        const leta = Math.floor(Math.random()*9999);

        return new Promise(async next=>{
            let medecin = new AsprofSchema({name:name,numero:numero,address:address,email:email, genre:genre, recovery:leta})
            await medecin.save().then(res=>{ next({etat:true, resultat:res})}).catch(err=>{ next({etat:false, err:err})})
        })
    }

    static getAssurancePro(){
        return new Promise(async next=>{
            await AsprofSchema.find().then(res=>next(res)).catch(err=>next(err))
        })
    }
    static setAssuranceVoyage(name, numero,origine,destination, birthDate, firstname, sexe, changeNumberDeJours, passport){
        const rec = Math.floor(Math.random()*9999);
        return new Promise(async next=>{
            let medecin = new Voyage({name:name,address:numero,paysOr:origine,paysDest:destination,birthDate:birthDate, firstname:firstname, sexe:sexe, changeNumberDeJours:changeNumberDeJours, passport:passport, recovery:rec})
            await medecin.save().then(res=>next({etat:true, resultat:res})).catch(err=>next({etat:false, err:err}))
        })
    }
}