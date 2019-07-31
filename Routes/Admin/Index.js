/*Ici Se trouve toutes les routes concernant le coté des Administrateur*/

/*
--------------- Je tiens à rapeler que j'utlise de ES6 coté Backend et je suis descendu à ES5 coté Frontend Car ce n'est pas tous les navigateurs du monde qui sont à jour-------------
 */

const express = require('express'); //Je require express afin de creer ce qu'on appel un router (C'est celui qui me permet de decrire quels sont mes routes que j'utilise
const router = express.Router(); // Je Crée maintenant ici mon routeur tout simplement en Appelant la methode Router() de Express
const { check, validationResult } = require('express-validator');
const {AdminQuerie} = require('../../Controller/ryuQuerie');

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
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let rdv = await AdminQuerie.getCommandeTotal("Render-vous");
            let assurance = await AdminQuerie.getCommandeTotal("Assistance");
            let TotalUser = await AdminQuerie.getAllUser()
            info.rdv = rdv;
            info.assurance = assurance;
            info.TotalUser = TotalUser;
            console.log(info)
            info.user = req.session.alloSante;
            res.render("index.twig",{info:info})

        /*
        ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
        parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
        Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
         */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else

    });

//Route vers login Avec Authentification

let user = {email:"admin@allo.ci", pass:"azerty225R"} // J'ai cré un un faux utilisateur qui fera la simulation d'un admin dans ma bd;

router.route('/login')
    .get((req,res)=>{
        res.render('signin.twig')
    })//ICI on a fini de faire notre première route qui etait un get. Regarder Bien ce qui va venir, cette fois ci je vaire un post sur la même route pour dire que si l'utilisateur post quelque chose sur cette route
    .post([
        check("email","email Invalide").not().isEmpty(),
        check("password","Veillez entrer un Mot de Passe Alphanumerique et d'au moins 8 Charactère").isAlphanumeric().isLength({ min: 8 })
        ], async (req,res)=>{

        /*
        Si vous remarquez bien je n'ai pas fait router.route('/').post((req,res)=>......
        tous simplement parce que une fois qu'on ecrit router.route('ma route que je veux') je peux enchainer toutes les methodes que je veux sur cette route de façon cascade
        Ex:router.route('/').get((req,res)=>{ traitement à faire; res.render('page')}).post((req,res)=>{ traitement à faire; res.redirect('/monCOmpte')}).put((req,res)=>{ traitement à faire; res.redirect('/Rochel')}).......
        le traitement avec le post en question
        ici aussi on va simuler un post. supposons que l'utilisateur veux envoyer dans des input som email/motdepasse
         */

        /*
        On va verifier si l'eamil respect les norme de email et si le mot de passe est au moins Alphanumeric et depasse 8 Charachtère;
        Pour cela on a utiliser Express-validator. C'est un module que j'ai installé pour la verification de ce que le user fait envoie aux serveurs
         */
        //On utilise req.check pour verifier vous verez d'autre personne utiliser req.checkBody c'est pareil sauf qu'eux ils sont encore derrière la préhistoire.
        //Donc je continue, req.check(1er Params, 2eme Params).methodeQuonVeutUtiliserPourVErifier()  1er Params = le name de l'input coté frontend 2eme Params = le message d'erreur qu'on veut envoyer à l'utilisateur au cas où notre methode qu'on prend pour verifier dis que l'utilisateur n'as pas respecté ce qu'on lui demande..... Batard d'utilisateur....
        //Après avoir fais ça on doit passer toutes les erreurs a une variable intermédiaire afin de pouvoir faire des conditions
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            console.log(errors)
            res.redirect('/ryu/login')
        }
        else {//le code viendra ici uniquement si l'utilisateur a bien remplie le formullaire.
            // je tiens à rapeler que depuis là on a pas verfié si l'utilisateur existe dans la bd.
            //On verifie juste s'il a bien fait rentré un email et un mot de passe de niveau moyen.
            /*
            tout le traitement peut être fait ici
             */
            //JE tiens à rapeler que avant pour recuperer ce que l'utilisateur envoie ont installais body-parser mais maintenant plus besoin, Express intègre Body Parser Directement Maintenant.
            const input = req.body;
            const admin = await AdminQuerie.getVerifyAdmin(input.email, input.password)
            if(admin.etat){

                console.log("ici")

                req.session.alloSante = admin.user;
                console.log(req.session.alloSante)
                res.redirect(301,'/ryu')
            }
            res.redirect('/ryu/login')
        }
        //Plus d'info sur express-validator ?  --> https://express-validator.github.io/docs/
    });
router.route('/client')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let rdv = await AdminQuerie.getCommandeInWait("Render-vous");
            let assurance = await AdminQuerie.getCommandeInWait("Assistance");
            let InWaitClinic = await AdminQuerie.getCommandewithEtat(2);
            let BackClinic = await AdminQuerie.getCommandewithEtat(3);
            let medecin = await AdminQuerie.getAllMedecin();
            info.medecin = medecin;
            info.rdv = rdv;
            info.assurance = assurance;
            info.InWaitClinic = InWaitClinic;
            info.BackClinic = BackClinic;
            info.user = req.session.alloSante;
            res.render("client.twig",{info:info});
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })
router.route('/medecin')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let medecin = await AdminQuerie.getAllMedecin();
            let ville = await AdminQuerie.getAllVille();
            info.medecin = medecin;
            info.ville = ville;
            info.user = req.session.alloSante;
            res.render("medecin.twig",{info:info});
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })
    .post([
        check("name","nom Invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("clinic","clinic Invalide").not().isEmpty(),
        check("specialite","specialite Invalide").not().isEmpty(),
        check("address","address Invalide").not().isEmpty(),
    ], async (req,res)=>{

        /*
        Si vous remarquez bien je n'ai pas fait router.route('/').post((req,res)=>......
        tous simplement parce que une fois qu'on ecrit router.route('ma route que je veux') je peux enchainer toutes les methodes que je veux sur cette route de façon cascade
        Ex:router.route('/').get((req,res)=>{ traitement à faire; res.render('page')}).post((req,res)=>{ traitement à faire; res.redirect('/monCOmpte')}).put((req,res)=>{ traitement à faire; res.redirect('/Rochel')}).......
        le traitement avec le post en question
        ici aussi on va simuler un post. supposons que l'utilisateur veux envoyer dans des input som email/motdepasse
         */

        /*
        On va verifier si l'eamil respect les norme de email et si le mot de passe est au moins Alphanumeric et depasse 8 Charachtère;
        Pour cela on a utiliser Express-validator. C'est un module que j'ai installé pour la verification de ce que le user fait envoie aux serveurs
         */
        //On utilise req.check pour verifier vous verez d'autre personne utiliser req.checkBody c'est pareil sauf qu'eux ils sont encore derrière la préhistoire.
        //Donc je continue, req.check(1er Params, 2eme Params).methodeQuonVeutUtiliserPourVErifier()  1er Params = le name de l'input coté frontend 2eme Params = le message d'erreur qu'on veut envoyer à l'utilisateur au cas où notre methode qu'on prend pour verifier dis que l'utilisateur n'as pas respecté ce qu'on lui demande..... Batard d'utilisateur....
        //Après avoir fais ça on doit passer toutes les erreurs a une variable intermédiaire afin de pouvoir faire des conditions
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            console.log(errors)
            res.redirect('/ryu/medecin')
        }
        else {//le code viendra ici uniquement si l'utilisateur a bien remplie le formullaire.
            // je tiens à rapeler que depuis là on a pas verfié si l'utilisateur existe dans la bd.
            //On verifie juste s'il a bien fait rentré un email et un mot de passe de niveau moyen.
            /*
            tout le traitement peut être fait ici
             */
            //JE tiens à rapeler que avant pour recuperer ce que l'utilisateur envoie ont installais body-parser mais maintenant plus besoin, Express intègre Body Parser Directement Maintenant.
            const input = req.body;
            const admin = await AdminQuerie.setMedecin(input.name,input.numero,input.clinic,input.address,input.specialite)
            res.redirect('/ryu/medecin')
        }
        //Plus d'info sur express-validator ?  --> https://express-validator.github.io/docs/
    });
router.route('/logout')
    .get((req,res)=>{
        req.session.destroy(function(err) {
            if(err) res.redirect('back')
            res.redirect('/ryu/login')
        })
    })





// il est l'heures d'exporter router afin de l'appeler ailleur. N'oubliez Pas. ici on a juste créer les routes mais pas le serveurs

module.exports = router;
