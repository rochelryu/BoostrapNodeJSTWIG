/*Ici Se trouve toutes les routes concernant le coté des Administrateur*/

/*
--------------- Je tiens à rapeler que j'utlise de ES6 coté Backend et je suis descendu à ES5 coté Frontend Car ce n'est pas tous les navigateurs du monde qui sont à jour-------------
 */

const express = require('express'); //Je require express afin de creer ce qu'on appel un router (C'est celui qui me permet de decrire quels sont mes routes que j'utilise
const router = express.Router(); // Je Crée maintenant ici mon routeur tout simplement en Appelant la methode Router() de Express
const { check, validationResult } = require('express-validator');
const {AdminQuerie} = require('../../Controller/AdminQuerie');
const scrap = require('scrape-it')
const {Messagerie, OrangeTocken} = require('../../Controller/Message');

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

router.route('/changeSer')
    .post([
        check("token","token Invalide").not().isEmpty(),
        check("code", "code Invalide").not().isEmpty()
    ],async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {const input = req.body;
            const admin = await AdminQuerie.delHisorique(input.token, input.code)
            if(admin.etat){
                res.send({etat:true})
            }
            else{
                res.send({etat:false,err:"Identifiant incorrect"})
            }

        }
    });

    router.route('/verifNumber')
    .post([
        check("numero","numero Invalide").not().isEmpty(),
    ],async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {
            const input = req.body;
            const admin = await AdminQuerie.getUserByNumber(input.numero)
            if(admin.etat){
                const message = await Messagerie.sendSmsForForgetPass(admin.user.prefix + admin.user.numero,admin.user.recovery);

                res.send({etat:true, user:{name:admin.user.name, ident:admin.user.ident}})
            }
            else{
                res.send({etat:false,err:"Identifiant incorrect"})
            }

        }
    });

    router.route('/verifNumberFinal')
    .post([
        check("ident","ident Invalide").not().isEmpty(),
        check("code","code Invalide").not().isEmpty(),
        check("newPass","newPass Invalide").not().isEmpty(),
    ],async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {
            const input = req.body;
            const admin = await AdminQuerie.updatePasswordUser(input.ident,input.newPass,input.code)
            if(admin.etat){
                res.send({etat:true, user:admin.user})
            }
            else{
                res.send({etat:false,err:"Identifiant incorrect"})
            }

        }
    });

router.route('/login')
    .post([
        check("numero","numero Invalide").not().isEmpty(),
        check("password","Veuillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {const input = req.body;
            const admin = await AdminQuerie.getVerifyUser(input.numero, input.password)
            if(admin.etat){
                res.send({etat:true,user:admin.user})
            }
            res.send({etat:false,err:"Identifiant incorrect"})
        }
    });
router.route('/signin')
    .post([
        check("name","Nom & prénom invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("address","address Invalide").not().isEmpty(),
        check("date","date Invalide").not().isEmpty(),
        check("sexe","date Invalide").not().isEmpty(),
        check("email","Email Invalide").isEmail(),
        check("password","Veuillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {
            const input = req.body;
            const admin = await AdminQuerie.setUser(input.password,input.name,input.numero,input.prefix,input.address,input.date,input.sexe, input.email)
            if(admin.etat){
                res.send({etat:true,user:admin.user})
            }
            res.send({etat:false,err:"enregistrement echoué Veuillez recommencé ultérieurement"})
        }
    });
    router.route('/editProfil')
    .post([
        check("name","Nom & prénom invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("address","address Invalide").not().isEmpty(),
        check("date","date Invalide").not().isEmpty(),
        check("email","Email Invalide").isEmail(),
        check("ident","Identifiant Invalide").not().isEmpty(),
        check("password","Veuillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.send({etat:false,err:errors})
        }
        else {
            const input = req.body;
            const admin = await AdminQuerie.updateUser(input.email,input.password,input.numero,input.address,input.ident,input.name,input.date,input.profil)
            if(admin.etat){
                res.send({etat:true,user:admin.user})
            }
            res.send({etat:false,err:"enregistrement echoué Veuillez recommencé ultérieurement"})
        }
    });
    router.route('/meteo')
    .get(async (req,res)=>{
        let input = req.query;
        let meteo = await AdminQuerie.meteo(input.latitude,input.longitude,input.local);
        res.send(meteo);
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
router.route('/pharma')
    .get(async (req,res)=>{
       const user = await AdminQuerie.ikeaDetails();
       res.send(user);
    });
    router.route('/pharma/braza')
    .get(async (req,res)=>{
       const user = await AdminQuerie.ikeaDetailsBrzaz();
       res.send(user);
    });
    router.route('/pharma/burkina')
    .get(async (req,res)=>{
       const user = await AdminQuerie.ouaga();
       res.send(user);
    });
    router.route('/pharma/paris')
    .get(async (req,res)=>{
       const user = await AdminQuerie.paris();
       res.send(user);
    });
    router.route('/pharma/yaounde')
    .get(async (req,res)=>{
       const user = await AdminQuerie.yaounde();
       res.send(user);
    });
router.route('/account/:ident')
    .get(async (req,res)=>{
        const user = await AdminQuerie.getUserByIdent(req.params.ident);
            res.send(user);
        });

router.route('/medoc')
    .get(async (req,res)=>{
        const user = await AdminQuerie.getMedoc();
            res.send({info:user});
        });

router.route('/search')
        .post([
        check("specialite","specialite invalide").not().isEmpty(),
        check("pays","Adresse Invalide").not().isEmpty()
        ], async (req,res)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
                res.send({etat:false,err:errors})
            }
            else {const input = req.body;
                const admin = await AdminQuerie.getMedecinByCountrie(input.pays,input.specialite);
                const second = await AdminQuerie.getEtablissementByCountrie(input.pays,input.specialite);
                console.log(second);
                res.send({etat:true,info:admin, eta:second})
                }
            }
        );

        router.route('/searchPays')
        .post([
        check("pays","Adresse Invalide").not().isEmpty()
        ], async (req,res)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
                res.send({etat:false,err:errors})
            }
            else {const input = req.body;
                const admin = await AdminQuerie.getMedecinByCountrieTrue(input.pays);
                const second = await AdminQuerie.getEtablissementByCountrieTrue(input.pays);
                console.log(second);
                res.send({etat:true,info:admin, eta:second})
                }
            }
        );
router.route('/edit/')
    .post([
        check("email","email Invalide").isEmail(),
        check("numero","numero Invalide").isLength({ max: 8 }).not().isEmpty(),
        check("password","Veuillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty(),
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
            res.send({etat:false,err:"Modification echoué Veuillez recommencé ultérieurement"})
        }
    });





// il est l'heures d'exporter router afin de l'appeler ailleur. N'oubliez Pas. ici on a juste créer les routes mais pas le serveurs

module.exports = router;