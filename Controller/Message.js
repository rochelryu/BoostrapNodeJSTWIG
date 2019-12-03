let config = require('../Setting/config');
const BulkSMS = require('bulksms');
const request = require('request');
const https = require('https');
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
    static sendSmsClinique(receiver, message){
        let receveirr = "tel:"+ receiver;
           let headers = {
               'Authorization': "Bearer "+config.sms.tokenOrange,
               'Content-Type': 'application/json'};
       let body = {
               outboundSMSMessageRequest: {
           address : receveirr, 
               senderAddress : "tel:+22548803377",
           outboundSMSTextMessage: {
               message : message  
       }}};   
        let options = {
               uri: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+22548803377/requests',
               method: 'POST',
               headers: headers,
               body: JSON.stringify(body)};
           request(options, function (error, response, body) {
            if (!error) {
               console.log(JSON.stringify(response));
            }        
            else {
                console.log('contractsB', error);
            }
            
           })
        }


    static sendOrangeAssistance(receiver, medecin, prefix, code, name){
        const salutation = (new Date().getHours() >= 13) ? "Bonsoir Mr/Mme"+name+", ": "Bonjour Mr/Mme"+name+", "
        let mes = salutation + "votre demande d'assistance médicale est en cours de traitement, vous allez être mis en contact avec un médecin (Dr "+ medecin+") veuillez communiquer votre numéro de demande d'assistance en présence du médecin. Numéro d'assistance : " + code+". \n Infos et Annulation : +225 66 000 700";
        let receveirr = "tel:"+ prefix + receiver;
           let headers = {
               'Authorization': "Bearer "+config.sms.tokenOrange,
               'Content-Type': 'application/json'};
       let body = {
               outboundSMSMessageRequest: {
           address : receveirr, 
               senderAddress : "tel:+22548803377",
           outboundSMSTextMessage: {
               message : mes  
       }}};   
        let options = {
               uri: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+22548803377/requests',
               method: 'POST',
               headers: headers,
               body: JSON.stringify(body)};
           request(options, function (error, response, body) {
       if (!error) {
               console.log(JSON.stringify(response));
               }        
               else {
                console.log('contractsB', error);
               }
           })
        }


        static sendOrangeAssistanceForMedecin(receiver, prefix, name, autreProbleme, motif, posA, numero){
            const salutation = (new Date().getHours() >= 13) ? "Allô santé express- Bonsoir Docteur": "Allô santé express- Bonjour Docteur";
            let mes = salutation + '\n Demande d’assistance médicale pour Mr/Mme '+ name+' \n Pathologie : '+ autreProbleme +' \n Message en commentaire du patient :  ' + motif+'. \n Lieu d’intervention : '+ posA +'.\n Numéro de téléphone de l’utilisateur '+ prefix +numero+' \n POUR INFO OU ANNULATION (+225 66 00 07 00)';
            let receveirr = "tel:"+ prefix + receiver;
               let headers = {
                   'Authorization': "Bearer "+config.sms.tokenOrange,
                   'Content-Type': 'application/json'};
           let body = {
                   outboundSMSMessageRequest: {
               address : receveirr, 
                   senderAddress : "tel:+22548803377",
               outboundSMSTextMessage: {
                   message : mes  
           }}};   
            let options = {
                   uri: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+22548803377/requests',
                   method: 'POST',
                   headers: headers,
                   body: JSON.stringify(body)};
               request(options, function (error, response, body) {
           if (!error) {
                   console.log(JSON.stringify(response));
                   }        
                   else {
                    console.log('contractsB', error);
                   }
               })
            }

           static sendOrangeRdv(receiver, clinic, prefix, code, date, hour, autreProbleme, address){
            const salutation = (new Date().getHours() >= 13) ? "Allô santé express – Bonsoir": "Allô santé express – Bonjour";
            let mes = salutation + '\n RDV le '+ date.getDate() +'/'+ (parseInt(date.getMonth(),10)+1) +'/'+ date.getFullYear()+ ' à '+ hour +' \n Etablissement : '+ clinic+' au service ' + autreProbleme+'.\n Situation géographique : '+ address +' \n REF '+ code +' A communiquer à l’accueil \n Info ou annulation : + (225) 66 000 700 / allosanteexpressinfos@gmail.com';
            let receveirr = "tel:"+ prefix + receiver;
               let headers = {
                   'Authorization': "Bearer "+config.sms.tokenOrange,
                   'Content-Type': 'application/json'};
           let body = {
                   outboundSMSMessageRequest: {
               address : receveirr, 
                   senderAddress : "tel:+22548803377",
               outboundSMSTextMessage: {
                   message : mes  
           }}};   
            let options = {
                   uri: 'https://api.orange.com/smsmessaging/v1/outbound/tel:+22548803377/requests',
                   method: 'POST',
                   headers: headers,
                   body: JSON.stringify(body)};
               request(options, function (error, response, body) {
           if (!error) {
                   console.log(JSON.stringify(response));
                   }        
                   else {
                    console.log('contractsB', error);
                   }
               })}

}
exports.OrangeTocken = () => {
    credentials="Basic clBVbmlibWREMTV0bTF4TEE1Ynk5OEczdHVpbXRHUGM6d3F5YzdYcGFGd0cyVzdHOQ==";
    let postData = "";
    postData += "grant_type=client_credentials";
    try {
        let options = {
            host: 'api.orange.com',
            path: '/oauth/v2/token'
        };
        options['method'] = 'POST';
        options['headers'] = {
            'Authorization': credentials,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        };
        let req = https.request (options, function(response) {
            response.setEncoding('utf8');
            let responseData = '';
            response.on ('data', function(data) { responseData += data; });
            response.on ('end', function() { let result = JSON.parse (responseData); console.log(result); });
       })
       .on('error', function(e) { console.log('err prem ', e) });
       req.write(postData);
       req.end();
    }
    catch(err){
        console.log("avec RR", err);
    }
}