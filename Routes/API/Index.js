/*Ici Se trouve toutes les routes concernant le coté des Administrateur*/

/*
--------------- Je tiens à rapeler que j'utlise de ES6 coté Backend et je suis descendu à ES5 coté Frontend Car ce n'est pas tous les navigateurs du monde qui sont à jour-------------
 */

const express = require('express'); //Je require express afin de creer ce qu'on appel un router (C'est celui qui me permet de decrire quels sont mes routes que j'utilise
const router = express.Router(); // Je Crée maintenant ici mon routeur tout simplement en Appelant la methode Router() de Express
const { check, validationResult } = require('express-validator');
const {AdminQuerie} = require('../../Controller/AdminQuerie');

//Première Route
router.route('/ville') // afin de decrire mieux une route on utilise la methode route("l'url de la route qu'on veut") ensuite on utilise la methode que nous vpulons utiliser (ex de methode : GET, POST, OPTIONS, PUT, DELETE, etc...)
// Dans mon cas ici je suis venu à la ligne parce que mon code Soit plus lisible sinon j'aurais pu tout faire en un ligne (ex: router.route('/').get()
    .get(async (req,res)=>{

        let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
        let ville = await AdminQuerie.getAllVille();
        info.ville = ville;
        res.send({info:info})

    });

//Route vers login Avec Authentification

router.route('/login')
    .post([
        check("email","email Invalide").isLength({max:8}),
        check("password","Veillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {const input = req.body;
        console.log(input)
            const admin = await AdminQuerie.getVerifyUser(input.email, input.password)
            if(admin.etat){
                console.log("ici")
                res.send({etat:true,user:admin.user})
            }
        console.log("la")
            res.send({etat:false,err:"Identifiant incorrect"})
        }
    });
router.route('/signin')
    .post([
        check("name","Nom & prénom invalide").not().isEmpty(),
        check("numero","numero Invalide").isLength({ max: 8 }).not().isEmpty(),
        check("address","numero Invalide").not().isEmpty(),
        check("date","date Invalide").not().isEmpty(),
        check("password","Veillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {const input = req.body;
            const admin = await AdminQuerie.setUser(input.password,input.name,input.numero,input.prefix,input.address,input.date)
            if(admin.etat){
                res.send({etat:true,user:admin.user})
            }
            res.send({etat:false,err:"enregistrement echoué Veillez recommencé ultérieurement"})
        }
    });
router.route('/autre/:ident')
    .get(async (req,res)=>{
        const user = await AdminQuerie.getUserByIdent(req.params.ident);
        if(user.etat){
            let info = {};
            let assistance = await AdminQuerie.getAllAutre(1);
            let rdv = await AdminQuerie.getAllAutre(2);
            info.assistance = assistance;
            info.rdv = rdv;
            res.send(info);
        }
        else{
            res.send({err:"tu es bête"})
        }
    });
router.route('/account/:ident')
    .get(async (req,res)=>{
        console.log(req.params.ident)
        const user = await AdminQuerie.getUserByIdent(req.params.ident);
            res.send(user);
        });
router.route('/edit/')
    .post([
        check("email","email Invalide").isEmail(),
        check("numero","numero Invalide").isLength({ max: 8 }).not().isEmpty(),
        check("password","Veillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty(),
        check("address","Adresse Invalide").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {const input = req.body;
            const admin = await AdminQuerie.updateUser(input.email,input.password,input.numero,input.address,input.ident)
            if(admin.etat){
                res.send({etat:true,user:admin.user})
            }
            res.send({etat:false,err:"Modification echoué Veillez recommencé ultérieurement"})
        }
    });





// il est l'heures d'exporter router afin de l'appeler ailleur. N'oubliez Pas. ici on a juste créer les routes mais pas le serveurs

module.exports = router;