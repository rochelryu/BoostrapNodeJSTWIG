var config = require('../Setting/config');
const BulkSMS = require('bulksms');
const SMS = new BulkSMS(config.sms.user, config.sms.pass);
const calendar = ['Jan', 'Fev', "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]
exports.Messagerie = class{
    static sendMessage(numero,medecinName,clinicName,name,date,code,services){
        const salutation = (new Date().getHours() >= 13) ? "Bonsoir "+name+";": "Bonjour "+name+";"
        const verbe = (services === "Assistance") ? " prise": " pris"
        let mess = salutation +" "+ services + verbe + ". Votre medecin est "+medecinName+ ". La clinique est "+clinicName+". Date: "+ new Date(date).getDate()+ " "+ calendar[parseInt(new Date(date).getMonth(),10)]+", "+new Date(date).getFullYear()  +". Code :" +code
        const nume = "+225"+numero
        console.log(mess.length, mess, nume)
        SMS.send(nume, mess, (err, result) => {
            if (err){
                console.error("message non envoyé : " + err);
            }
            else {
                console.log("message envoyé : " + result)
            }
        });

    }

}