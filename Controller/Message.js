var config = require('../Setting/config');
const BulkSMS = require('bulksms');
const request = require('request');
const SMS = new BulkSMS(config.sms.user, config.sms.pass);
const calendar = ['Jan', 'Fev', "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]
exports.Messagerie = class{
    static sendMessage(numero,medecinName,clinicName,name,date,code,services){
        const salutation = (new Date().getHours() >= 13) ? "Bonsoir "+name+";": "Bonjour "+name+";"
        const verbe = (services === "Assistance") ? " prise": " pris"
        let mess = salutation +" "+ services + verbe + ". Votre medecin est "+medecinName+ ". La clinique est "+clinicName+". Date: "+ new Date(date).getDate()+ " "+ calendar[parseInt(new Date(date).getMonth(),10)]+", "+new Date(date).getFullYear()  +". Code :" +code
        const nume = "225"+numero
        console.log(mess.length, mess, nume)
        request({url:'https://api.1s2u.io/bulksms?username=smssandersn019&password=web46802&mt=1&fl=Flash/None Flash Message &sid=Allo Sante Express&mno='+ nume +'&msg='+mess,"Content-Type": "charset=utf-8"}, function(err,httpResponse,body){
            console.log("err ",err, "Status",httpResponse, " body", body);
        })
        /*SMS.send(nume, mess, (err, result) => {
            if (err){
                console.error("message non envoyé : " + err);
            }
            else {
                console.log("message envoyé : " + result)
            }
        });*/

    }
    static sendMessageClinic(clinicName,num,message){
        request({url:'https://api.1s2u.io/bulksms?username=smssandersn019&password=web46802&mt=1&fl=Flash/None Flash Message &sid='+clinicName+'&mno='+ num +'&msg='+message,"Content-Type": "charset=utf-8"}, function(err,httpResponse,body){
            console.log("err ",err, "Status",httpResponse, " body", body);
        })

    }

}