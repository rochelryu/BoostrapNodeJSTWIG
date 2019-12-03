//Ici c'est l'endroit ideal pour appeler mon module qui permet de faire la connexion à ma base de données
//Ainsi que les routes crées

//Sur le serveur on va importer generalement les modules qui doivent exister au plus haut niveau dans notre architecture
// Vous ne comprenez ?? pas grave. J'explique. On est d'accord que si on doit créer une session la session doit exister partout sur notre architecture et qu'on ne doit pas l'importer/exporter à chaque fois qu'on aura besoin puisqu'elle doit vivre au sin de notre application
//Donc ici on poura implementer les modules qui ont le plus fort niveau les modules de niveau inférieur pas peuvent mais doivent être àppélé dans notre module interne qui en aura besoin.
//Tu ne comprends pas toujours ?? hé bein Basta. Je ne peux pas te decrocher la lune puisque tu en as déjà une.
const express = require('express');
var twig = require("twig");
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser')
const cookie = require('cookieparser');
const config = require('./Setting/config');
const AdminRoute = require('./Routes/Admin/Index')
const API = require('./Routes/API/Index')
const ClientRoute = require('./Routes/Client/Index')
class Serveur {
     constructor(port){
         this.port = port;
         this.app = express();
         this.setting();
         this.middleware();
         this.route();
     }
     getApp(){
         return this.app;
}

     setting(){
         this.app.use(express.static(__dirname+'/Views')); //On utilise ce paramettre pour dire a express ou se trouve nos fichier images | css | js. on les appels souvents des fichiers assets
         this.app.set('views', __dirname+'/Views') //On utilise ce paramettre pour dire a express ou se trouve nos fichier page Template fontend
         // This section is optional and used to configure twig.
         this.app.set('view engine', 'twig');
         this.app.set("twig options", {
             allow_async: true, // Allow asynchronous compiling
             strict_variables: false
         });
         this.app.use(bodyParser.json({ limit: '50mb', extended: true })); // pour formatter tout ce qui est envoyé en post en application/json
         this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })) // pour crypter tout ce qui est post en application/x-www-form-urlencoded
     }



     middleware(){
         this.app.use(morgan("dev"));
         this.app.use(session({
             secret: config.secret,
             resave: config.resave,
             saveUninitialized: config.saveUninitialized,
         }))
     }

     route(){
         this.app.use('/ryu', AdminRoute);
         this.app.use('/API/V1/focus/', API);
         this.app.use('/', ClientRoute);
     }
    start(){
        this.app.listen(this.port, ()=>{
            console.log(`en cours sur ${this.port}`);
        })
    }
}
module.exports = Serveur