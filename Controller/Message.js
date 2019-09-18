var config = require('../Setting/config');
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
        var receveirr = "tel:"+ receiver;
           var headers = {
               'Authorization': "Bearer "+config.sms.tokenOrange,
               'Content-Type': 'application/json'};
       var body = {
               outboundSMSMessageRequest: {
           address : receveirr, 
               senderAddress : "tel:+22548803377",
           outboundSMSTextMessage: {
               message : message  
       }}};   
        var options = {
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
        const salutation = (new Date().getHours() >= 13) ? "Bonsoir "+name+", ": "Bonjour "+name+", "
        let mes = salutation + 'votre assistance est confirmée. Dr '+ medecin+' sera là pour vous suivre au service ' + code+'. \n POUR INFO OU ANNULATION (00 00 00 00)';
        var receveirr = "tel:"+ prefix + receiver;
           var headers = {
               'Authorization': "Bearer "+config.sms.tokenOrange,
               'Content-Type': 'application/json'};
       var body = {
               outboundSMSMessageRequest: {
           address : receveirr, 
               senderAddress : "tel:+22548803377",
           outboundSMSTextMessage: {
               message : mes  
       }}};   
        var options = {
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

           static sendOrangeRdv(receiver, clinic, prefix, code, name, date, hour){
            const salutation = (new Date().getHours() >= 13) ? "Bonsoir "+name+", ": "Bonjour "+name+", "
            let mes = salutation + 'votre rendez-vous est pour '+ date.getDate() +'/'+ (parseInt(date.getMonth(),10)+1) +'/'+ date.getFullYear()+ ' à '+ hour +' à la clinique '+ clinic+' au service ' + code+'. \n POUR INFO OU ANNULATION (00 00 00 00)';
            var receveirr = "tel:"+ prefix + receiver;
               var headers = {
                   'Authorization': "Bearer "+config.sms.tokenOrange,
                   'Content-Type': 'application/json'};
           var body = {
                   outboundSMSMessageRequest: {
               address : receveirr, 
                   senderAddress : "tel:+22548803377",
               outboundSMSTextMessage: {
                   message : mes  
           }}};   
            var options = {
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
exports.OrangeTocken = (CLIENT_ID, CLIENT_SECRET, res ) => {
    credentials="Basic QmJaTHp6V1ZROFdBMWNoUDJKdzZldTFKVEFuQWtVU0Q6dmJLblRMR3g5MkRZaWRKVw==";
    var postData = "";
    postData += "grant_type=client_credentials";
    try {
        var options = {
            host: 'api.orange.com',
            path: '/oauth/v2/token'
        };
        options['method'] = 'POST';
        options['headers'] = {
            'Authorization': credentials,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        };
        var req = https.request (options, function(response) {
            response.setEncoding('utf8');
            var responseData = '';
            response.on ('data', function(data) { responseData += data; });
            response.on ('end', function() { var result = JSON.parse (responseData); console.log(result); });
       })
       .on('error', function(e) { console.log('err prem ', e) });
       req.write(postData);
       req.end();
    }
    catch(err){
        console.log("avec RR", err);
    }
}