/*Ici Se trouve toutes les routes concernant le coté des Administrateur*/

/*
--------------- Je tiens à rapeler que j'utlise de ES6 coté Backend et je suis descendu à ES5 coté Frontend Car ce n'est pas tous les navigateurs du monde qui sont à jour-------------
 */

const express = require('express'); //Je require express afin de creer ce qu'on appel un router (C'est celui qui me permet de decrire quels sont mes routes que j'utilise
const router = express.Router(); // Je Crée maintenant ici mon routeur tout simplement en Appelant la methode Router() de Express
const { check, validationResult } = require('express-validator');
const {AdminQuerie} = require('../../Controller/AdminQuerie');

//Première Route
router.route('/') // afin de decrire mieux une route on utilise la methode route("l'url de la route qu'on veut") ensuite on utilise la methode que nous vpulons utiliser (ex de methode : GET, POST, OPTIONS, PUT, DELETE, etc...)
// Dans mon cas ici je suis venu à la ligne parce que mon code Soit plus lisible sinon j'aurais pu tout faire en un ligne (ex: router.route('/').get()
    .get(async (req,res)=>{
        /*
        ICI je tiens à notifié que le paramettre req = requête de client, donc je peux recuperer son addresse ip, le nom de sa machine, son type de navigateur, ses cookies, ses en tête etc....
        le paramettre res = response du serveur, generalement c'est la reponse qu'on envoie au client après le traitement de sa demande req.
        On utilise res.send lorsque on veut envoyer juste des variable(Utile pour les Dev Backend de logiciel Desktop).
        On utilise res.json lorsque on veut envoyer juste des donné formaté en JSON NAtif Adons(Utile pour les Dev Backend de logiciel Mobile).
        On utilise res.render lorsque on veut envoyer une page Web comme par exemple HTML, Pug, TWIG, HBS, etc...(Utile pour les Dev Backend de Web App).
        Vous verrez aussi res.sendFile, res.renderFile, etc..., ce sont tous des methodes de rendu de page Web Mais res.render reste le meilleur.
        On utilise res.redirect lorsque on veut faire une redirection à l'utilisateur après avoir fini de traiter sa demande(Ex: un Utilisateur cherhce à se connecter sur la route /login. Après avoir finis de verifier son couple email/password et qu'il est vraiment ce qu'il pretend on peut le rediriger vers /accueil pour que la route /accueil prenne le relais afin de lui afficher la page d'accueil).
         */
        let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
        let ville = await AdminQuerie.getAllVille();
        info.ville = ville;
        if(req.session.Client) {
            info.user = req.session.Client;
            res.render("focus/index.twig",{info:info})
        }
        else {
            info.user = "nil"
            res.render("focus/index.twig",{info:info})
        } //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else

    });

//Route vers login Avec Authentification

router.route('/login')
    .post([
        check("email","email Invalide").isEmail(),
        check("password","Veuillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.redirect('/')
        }
        else {const input = req.body;
            const admin = await AdminQuerie.getVerifyUser(input.email, input.password)
            if(admin.etat){


                req.session.Client = admin.user;
                res.redirect(301,'/account')
            }
            res.redirect('/')
        }
    });
router.route('/signin')
    .post([
        check("email","email Invalide").isEmail(),
        check("name","Nom & prénom invalide").not().isEmpty(),
        check("numero","numero Invalide").isLength({ max: 8 }).not().isEmpty(),
        check("address","numero Invalide").not().isEmpty(),
        check("password","Veuillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").not().isEmpty()
    ],async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.redirect('/')
        }
        else {const input = req.body;
            const admin = await AdminQuerie.setUser(input.email,input.password,input.name,input.numero,input.address,input.date)
            if(admin.etat){

                req.session.Client = admin.user;
                res.redirect(301,'/account')
            }
            res.redirect('/')
        }
    });

router.route('/account')
    .get((req,res)=>{
        if(req.session.Client) {
            res.render("focus/profil.twig",{info:req.session.Client})
        }

        else res.redirect("/") //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })
router.route('/logout')
    .get((req,res)=>{
        req.session.Client = undefined
            res.redirect('/')
    })
    router.route('/forget')
    .get(async(req,res)=>{

    })





// il est l'heures d'exporter router afin de l'appeler ailleur. N'oubliez Pas. ici on a juste créer les routes mais pas le serveurs

module.exports = router;