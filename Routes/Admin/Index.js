/*Ici Se trouve toutes les routes concernant le coté des Administrateur*/

/*
--------------- Je tiens à rapeler que j'utlise de ES6 coté Backend et je suis descendu à ES5 coté Frontend Car ce n'est pas tous les navigateurs du monde qui sont à jour-------------
 */

const express = require('express'); //Je require express afin de creer ce qu'on appel un router (C'est celui qui me permet de decrire quels sont mes routes que j'utilise
const router = express.Router(); // Je Crée maintenant ici mon routeur tout simplement en Appelant la methode Router() de Express
const { check, validationResult } = require('express-validator');
const {AdminQuerie} = require('../../Controller/AdminQuerie');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../../Setting/config');

const storageFixe = multer.diskStorage({
    destination: './Views/images/tools/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' +file.originalname);
    }
});

let uploadFixe = multer({
    storage: storageFixe,
}).single('fixeInput');
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
        if(req.session.alloSante && req.session.alloSante.etat === 3) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let rdv = await AdminQuerie.getCommandeTotal("Render-vous");
            let assurance = await AdminQuerie.getCommandeTotal("Assistance");
            let TotalUser = await AdminQuerie.getAllUser()
            info.rdv = rdv;
            info.assurance = assurance;
            info.TotalUser = TotalUser;
            info.user = req.session.alloSante;
            res.render("ind.twig",{info:info})
        /*
        ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
        parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
        Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
         */
        }
        else if(req.session.alloSante && req.session.alloSante.etat === 1) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let today = await AdminQuerie.getAllServiceInToday(req.session.alloSante.clinicName);
            let became = await AdminQuerie.getAllServiceInBecame(req.session.alloSante.clinicName);
            let old = await AdminQuerie.getAllClientByClinicName(req.session.alloSante.clinicName);
            info.user = req.session.alloSante;
            info.today = today;
            info.old = old;
            info.became = became;
            res.render("index2.twig",{info:info})
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else

    });


    router.route('/details/:id')
    .get(async (req,res)=>{
        if(req.session.alloSante){
            if(req.query.l === "1"){
                const ass = await AdminQuerie.getAssuranceByRecovery(req.params.id);
            res.render('details.twig', {info:ass, type:"Santé", etape:"Particulier"});
            }
            else if(req.query.l === "2"){
                const ass = await AdminQuerie.getAssuranceVoyageByRecovery(req.params.id);
            res.render('details.twig', {info:ass, type:"Voyage", etape:"Particulier"});
            }
            else if(req.query.l === "4"){
                const ass = await AdminQuerie.getAssuranceProfesssionelByRecovery(req.params.id);
                res.render('details.twig', {info:ass, type:ass.genre, etape:"Professionnels"});
            }
            else if(req.query.l === "5"){
                const ass = await AdminQuerie.getAssuranceAutoByRecovery(req.params.id);
                res.render('details.twig', {info:ass, type:"Auto", etape:"Particulier"});
            }
            else if(req.query.l === "6"){
                const ass = await AdminQuerie.getAssuranceMotoByRecovery(req.params.id);
                res.render('details.twig', {info:ass, type:"Moto", etape:"Particulier"});
            }
            else{
                res.redirect('/ryu');
            }

        }
        else res.redirect('/ryu/login');
    })

    router.route('/medocDele/:id')
    .get(async (req,res)=>{
        if(req.session.alloSante){
            const del = await AdminQuerie.delMedoc(parseInt(req.params.id,10));
            res.redirect('/ryu/medoc');
        }
        else res.redirect('/ryu/login');
    })


    router.route('/prof/:id')
    .get(async (req,res)=>{
        if(req.session.alloSante){
            const ass = await AdminQuerie.getAssuranceProfByRecovery(req.params.id);
            res.render('prof.twig', {info:ass});

        }
        else res.redirect('/ryu/login');
    })
    router.route('/compose') // afin de decrire mieux une route on utilise la methode route("l'url de la route qu'on veut") ensuite on utilise la methode que nous vpulons utiliser (ex de methode : GET, POST, OPTIONS, PUT, DELETE, etc...)
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

        if(req.session.alloSante && req.session.alloSante.etat === 1) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let today = await AdminQuerie.getAllServiceInToday(req.session.alloSante.clinicName);
            let became = await AdminQuerie.getAllServiceInBecame(req.session.alloSante.clinicName);
            info.user = req.session.alloSante;
            info.today = today;
            info.became = became;
            res.render("sendMail.twig",{info:info})
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else

    });

router.route('/autreAS')
    .post([
        check("name","nom Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.redirect('/ryu/medecin')
        }
        else {
            const input = req.body;
            const admin = await AdminQuerie.setAutre(input.name, 1);

            if(admin.etat){
                res.redirect(301,'/ryu/medecin')
            }
            res.redirect('/ryu/medecin')
        }
        //Plus d'info sur express-validator ?  --> https://express-validator.github.io/docs/
    });
router.route('/autre')
    .post([
        check("name","nom Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.redirect('/ryu/addPharma')
        }
        else {
            const input = req.body;
            const admin = await AdminQuerie.setAutre(input.name, 2);
            if(admin.etat){
                res.redirect(301,'/ryu/addPharma')
            }
            res.redirect('/ryu/addPharma')
        }
        //Plus d'info sur express-validator ?  --> https://express-validator.github.io/docs/
    });
//Route vers login Avec Authentification
router.route('/login')
    .get((req,res)=>{
        res.render('signin.twig')
    })//ICI on a fini de faire notre première route qui etait un get. Regarder Bien ce qui va venir, cette fois ci je vaire un post sur la même route pour dire que si l'utilisateur post quelque chose sur cette route
    .post([
        check("email","email Invalide").not().isEmpty(),
        check("password","Veillez entrer un Mot de Passe d'au moins 6 Charactère").isLength({ min: 6 })
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
            let mtd = crypto.createHmac("SHA256", input.password).update("Yabana, An other NaN").digest('hex')
            const admin = await AdminQuerie.getVerifyAdmin(input.email, input.password)
            if(admin.etat){


                req.session.alloSante = admin.user;
                res.redirect(301,'/ryu')
            }
            res.redirect('/ryu/login')
        }
        //Plus d'info sur express-validator ?  --> https://express-validator.github.io/docs/
    });
router.route('/refetablissement')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {};
            let Admin = await AdminQuerie.getAllEtablissement();
            let ville = await AdminQuerie.getAllVille();
            info.Admin = Admin;
            info.ville = ville;
            console.log("ici c'est paris",Admin.length)
            info.user = req.session.alloSante;
            res.render('Etablissement.twig', {info: info})
        }
        else res.redirect('/ryu/login')
    });
router.route('/refetablissements')
    .post(uploadFixe,[
        check("name","Pseudo Invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("nameRespo","Nom de Clinique Invalide").not().isEmpty(),
        check("address","Mot de passe Invalide").not().isEmpty(),
    ],async (req,res)=>{
        if(req.session.alloSante) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                req.session.addClinic = errors;

                res.redirect('/ryu/refetablissement')
            } else {
                const input = req.body;
                const file = (req.file) ? req.file.filename: "hospital.png";
                let admin = await AdminQuerie.setEtablissementRef(input.name,input.nameRespo,input.fonction,input.email,input.numero,input.numeroSecond,input.localisation,input.complementaire,input.pays,input.address,input.field,file,input.tarif,input.debut,input.fin,input.remboursement)
                console.log(admin);
                res.redirect('/ryu/refetablissement')
            }
        }
        else{
            res.send({etat:"tu es bête"})
        }
    })
    router.route('/refetablissementsEdit')
    .post(uploadFixe,[
        check("name","Pseudo Invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("nameRespo","Nom de Clinique Invalide").not().isEmpty(),
        check("address","email Invalide").not().isEmpty(),
    ],async (req,res)=>{
        if(req.session.alloSante) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.session.addClinic = errors;

                res.redirect('/ryu/refetablissement')
            } else {
                const input = req.body;
                const field = input.field.split(',');
                const tarif = input.tarif.split(',');
                const file = (req.file) ? req.file.filename: input.hideFile;
                let admin = await AdminQuerie.updateEtablissementRef(input.code,input.name,input.nameRespo,input.fonction,input.email,input.numero,input.numeroSecond,input.localisation,input.complementaire,input.pays,input.address,field,file,tarif,input.debut,input.fin,input.remboursement)
                res.redirect('/ryu/refetablissement')
            }
        }
        else{
            res.send({etat:"tu es bête"})
        }
    })

router.route('/addPharma')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {};
            let Admin = await AdminQuerie.getAllAdmin();
            let ville = await AdminQuerie.getAllVille();
            let rdv = await AdminQuerie.getAllAutre(2);
            info.rdv = rdv;
            info.Admin = Admin;
            info.ville = ville;
            info.user = req.session.alloSante;
            res.render('addPharmacie.twig', {info: info})
        }
        else res.redirect('/ryu/login')
    })
    .post([
        check("name","Pseudo Invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("clinic","Nom de Clinique Invalide").not().isEmpty(),
        check("address","email Invalide").not().isEmpty(),
        check("password","Mot de passe Invalide").not().isEmpty(),
    ],async (req,res)=>{
        if(req.session.alloSante) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.session.addClinic = errors;
                res.redirect('/ryu/addPharma')
            } else if (errors.isEmpty() && req.body.password === req.body.confirmpassword) {
                let admin = await AdminQuerie.setAdmin(req.body.email, req.body.password, req.body.name, req.body.numero, 1, req.body.clinic, req.body.address, req.body.pays, req.body.nameRespo, req.body.fonction, req.body.field, req.body.tarif);
                if (admin.etat) {
                    res.redirect('/ryu/addPharma')
                } else {
                    res.redirect('/ryu/addPharma')
                }
            }
        }
        res.send({etat:"tu es bête"})
    })

    router.route('/addPharmaEdit')
    .post([
        check("name","Pseudo Invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("clinic","Nom de Clinique Invalide").not().isEmpty(),
        check("email","email Invalide").isEmail(),
        check("address","email Invalide").not().isEmpty(),
    ],async (req,res)=>{
        if(req.session.alloSante) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('/ryu/addPharma')
            } else {
                const field = req.body.field.split(',');
                const tarif = req.body.tarif.split(',');
                let admin = await AdminQuerie.updateAdmins(req.body.code, req.body.email, req.body.name, req.body.numero, 1, req.body.clinic, req.body.address, req.body.pays, req.body.nameRespo, req.body.fonction, field, tarif);
                if (admin.etat) {
                    res.redirect('/ryu/addPharma')
                } else {
                    res.redirect('/ryu/addPharma')
                }
            }
        }
        res.send({etat:"tu es bête"})
    })

router.route('/test')
    .get(async (req,res)=>{
        /*await axios.post('https://bulksms.vsms.net/eapi/submission/send_sms/2/2.0',{
            username: 'dsanders31',
            password: 'pacers31',
            dca:"16bit",
        msisdn:"+22548803377",
        message:"Salut la faéme",
        })
            .then(function (response) {
               res.send(response)
            }).catch(err=>{
                console.log("err de ouf", err)
                res.send(err);
            });*/
       /* await twilio.messages.create({
            body: 'Hello Wrold ééé ?',
            from: '+13852173081',
            to: '+22548803377'
        })
            .then(message => {console.log(message.sid);res.send(message)})
            .catch(err=>{
            console.log("err", err);
            res.send(err);
        });*/

        res.send({focus:"beta"})
       //?username=john&password=xxxxxxxxx&dca=16bit&msisdn=441231234&message=004200430044
    });
router.route('/client')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {}
            let clients = await AdminQuerie.getAllUsersWithServices();
            for (let i in clients){
                let pays = await AdminQuerie.getPaysByPrefix(clients[i].prefix);
                clients[i].pays = pays.name;
                continue;
            }

             // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            /*let rdv = await AdminQuerie.getCommandeInWait("Render-vous");
            let assurance = await AdminQuerie.getCommandeInWait("Assistance");
            let InWaitClinic = await AdminQuerie.getCommandewithEtat(2);
            let BackClinic = await AdminQuerie.getCommandewithEtat(3);
            let medecin = await AdminQuerie.getAllMedecin();
            info.medecin = medecin;
            info.rdv = rdv;
            info.assurance = assurance;
            info.InWaitClinic = InWaitClinic;
            info.BackClinic = BackClinic;
            info.user = req.session.alloSante;*/
            info.clients = clients;
            info.user = req.session.alloSante;
            res.render("client3BD.twig",{info:info});
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })


    router.route('/listAssistance')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {}
            let medecinAss = await AdminQuerie.getAllMedecin(2);
            let assurance = await AdminQuerie.getCommandeInWait("Assistance");
            let total = await AdminQuerie.getCommandewithEtat(2,"Assistance");
            /*for (let i in assurance){
                let clientComplet = await AdminQuerie.getUserByIdent(assurance[i].ident);
                clients[i].clientComplet = clientComplet;
                continue;
            }*/
             // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            /*let rdv = await AdminQuerie.getCommandeInWait("Render-vous");
            let assurance = await AdminQuerie.getCommandeInWait("Assistance");
            let InWaitClinic = await AdminQuerie.getCommandewithEtat(2);
            let BackClinic = await AdminQuerie.getCommandewithEtat(3);
            let medecin = await AdminQuerie.getAllMedecin();
            info.medecin = medecin;
            info.rdv = rdv;
            info.assurance = assurance;
            info.InWaitClinic = InWaitClinic;
            info.BackClinic = BackClinic;
            info.user = req.session.alloSante;*/
            info.assistance = assurance;
            info.medecinAss = medecinAss;
            info.total = total;
            info.user = req.session.alloSante;
            res.render("client3ASSi.twig",{info:info});
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })

    router.route('/listRendezVous')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {}
            let medecinAss = await AdminQuerie.getAllAdmin();
            let rdv = await AdminQuerie.getCommandeInWait("Render-vous");
            let total = await AdminQuerie.getCommandewithEtat(3,"Render-vous");
            let enAttent = await AdminQuerie.getCommandewithEtat(2,"Render-vous");
            /*for (let i in assurance){
                let clientComplet = await AdminQuerie.getUserByIdent(assurance[i].ident);
                clients[i].clientComplet = clientComplet;
                continue;
            }*/
             // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            /*let rdv = await AdminQuerie.getCommandeInWait("Render-vous");
            let assurance = await AdminQuerie.getCommandeInWait("Assistance");
            let InWaitClinic = await AdminQuerie.getCommandewithEtat(2);
            let BackClinic = await AdminQuerie.getCommandewithEtat(3);
            let medecin = await AdminQuerie.getAllMedecin();
            info.medecin = medecin;
            info.rdv = rdv;
            info.assurance = assurance;
            info.InWaitClinic = InWaitClinic;
            info.BackClinic = BackClinic;
            info.user = req.session.alloSante;*/
            info.assistance = rdv;
            info.total = total;
            info.enAttent = enAttent;
            info.medecinAss = medecinAss;
            info.user = req.session.alloSante;
            res.render("client3Rdv.twig",{info:info});
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })
router.route('/edit')
    .get(async (req,res)=>{
        if(req.session.alloSante){
            let info ={};
            info.user = req.session.alloSante;
            info.err = req.session.errEdit;
            res.render("edit.twig",{info:info});
        }
        else res.redirect('/ryu/login')
    })
    .post([
        check("old","Ancien mot de passe Invalide").not().isEmpty(),
        check("newPass","Nouveau mot de passe Invalide").not().isEmpty(),
        check("ConfnewPass","Confirmation mot de passe Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            req.session.errEdit = errors.errors
            res.redirect('/ryu/edit')
        }
        else if (errors.isEmpty() && req.body.newPass === req.body.ConfnewPass){
            const input = req.body;
            const admin = await AdminQuerie.updateAdmin(input.old,input.newPass,req.session.alloSante.ident)
            if(admin.user !==null){
                req.session.alloSante = admin.user;
                req.session.errEdit = [{ value: '', msg: ' Mot de passe changé avec succès', param: 'old', location: 'body' }];
                res.redirect('/ryu/edit')
            }
        else{
                req.session.errEdit = [{ value: '', msg: ' Erreur, Ancien mot de passe Incorrect', param: 'old', location: 'body' }];
                res.redirect('/ryu/edit')
            }
        }
        else {
            req.session.errEdit = [{ value: '', msg: ' le confirmation et le nouveau mot de passe ne coresponde pas', param: 'old', location: 'body' }];
            res.redirect('/ryu/edit')
        }
    });
router.route('/ville')
.post([
    check("pays","pays Invalide").not().isEmpty(),
    check("prefix","specialite Invalide").not().isEmpty(),
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
        res.redirect('/ryu/medecin')
    }
    else {
        const input = req.body;
        const admin = await AdminQuerie.setVille(input.pays,input.prefix);
        res.redirect('/ryu/medecin')
    }
});
router.route('/assurance')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let sante = await AdminQuerie.getAssuranceSante();
            let voyage = await AdminQuerie.getAssuranceVoyage();
            let pro = await AdminQuerie.getAssurancePro();
            let auto = await AdminQuerie.getAssuranceAuto();
            let moto = await AdminQuerie.getAssuranceMoto();
            info.sante = sante;
            info.voyage = voyage;
            info.pro = pro;
            info.auto = auto;
            info.moto = moto;
            info.user = req.session.alloSante;
            res.render("assurance.twig",{info:info});
            
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    });
    
router.route('/medoc')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let Medoc = await AdminQuerie.getMedoc();
            info.Medoc = Medoc;
            info.user = req.session.alloSante;
            res.render("medoc.twig",{info:info});

        }
        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })
    .post([
        check("name","nom Invalide").not().isEmpty(),
        check("price","numero Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.redirect('/ryu/medoc')
        }
        else {
            const input = req.body;
            const ordon = (input.ordon == "on") ? true:false;
            const admin = await AdminQuerie.setMedoc(input.name,input.price,ordon, input.familie)
            res.redirect('/ryu/medoc')
        }
    });

router.route('/medecin')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let medecin = await AdminQuerie.getAllMedecin(2);
            let ville = await AdminQuerie.getAllVille();
            let admin = await AdminQuerie.getAllAdmin();
            const path = await AdminQuerie.getAllAutre(1);
            info.medecin = medecin;
            info.ville = ville;
            info.pathologie = path;
            info.admin = admin;
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
        check("pays","pays Invalide").not().isEmpty(),
        check("address","address Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.redirect('/ryu/medecin')
        }
        else {
            const input = req.body;
            const numeroSecond = (input.numeroSecond !== "") ? input.numeroSecond : "";
            const ouverture = "";
            const fermerture = "";
            const tarif = "";
            const remboursement = "";
            const moyenDePayement = "";
            const admin = await AdminQuerie.setMedecin(input.name,input.numero,input.clinic,input.address,input.specialite, input.pays,2,"doctor.png", input.email, numeroSecond,ouverture,fermerture,input.onm,moyenDePayement,tarif,remboursement,input.codePostal)
            
            res.redirect('/ryu/medecin')
        }
    });

    router.route('/medecinEdit')
    .post([
        check("name","nom Invalide").not().isEmpty(),
        check("numero","numero Invalide").not().isEmpty(),
        check("pays","pays Invalide").not().isEmpty(),
        check("address","address Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.redirect('/ryu/medecin')
        }
        else {
            const input = req.body;
            const numeroSecond = (input.numeroSecond !== "") ? input.numeroSecond : "";
            const ouverture = "";
            const fermerture = "";
            const tarif = "";
            const remboursement = "";
            const moyenDePayement = "";

            const admin = await AdminQuerie.updateMedecin(input.code,input.name,input.numero,input.clinic,input.address,input.specialite, input.pays,2,"doctor.png", input.email, numeroSecond,ouverture,fermerture,"",moyenDePayement,tarif,remboursement,input.codePostal)
            res.redirect('/ryu/medecin')
        }
    });
router.route('/refmedecin')
    .get(async (req,res)=>{
        if(req.session.alloSante) {
            let info = {} // je crée une variable info  qui va prendre après les différentes valeur du traitement avec ma base de donnés
            let medecin = await AdminQuerie.getAllMedecin(1);
            let ville = await AdminQuerie.getAllVille();
            let admin = await AdminQuerie.getAllAdmin();
            info.medecin = medecin;
            info.ville = ville;
            info.admin = admin;
            info.user = req.session.alloSante;
            res.render("medecinRef.twig",{info:info});
            /*
            ICi je n'ai pas fait directement info.fakeLangage = [{nom:"Rochel", language:"JS", level: "85%"},{nom:"Ryu", language:"TS",...
            parce que le retour de nos different traitement avec la base de Donné peut retourné des fois des tableau ou des objet Simple ou encore d'autre type du coup c'est plus facile d'enregistrer cela dans une variable intermédiaire afin de faire d'autre traitement si on veut puis après venir  l'assigner à notre grand objet contenant tout.
            Mais bon ça c'est mon avis personnel, vous pouvez choisir de faire l'autre option. LE code C'est la Factorisation.
             */
        }

        else res.redirect('/ryu/login') //je ne met pas de else parce que une fois qu'un if est ecrit ce qui est en dessous est toujours un else
    })
    .post(uploadFixe,[
        check("name","nom Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
        //console.log(errors);
            res.redirect('/ryu/refmedecin')
        }
        else {
            const input = req.body;
            const file = (req.file) ? req.file.filename: 'doctor.png';
            const numeroSecond = (input.numeroSecond !== "") ? input.numeroSecond : "";
            const admin = await AdminQuerie.setMedecin(input.name,input.numero,input.clinic,input.address,input.specialite, input.pays, 1, file, input.email, numeroSecond, input.debut, input.fin,input.onm,input.moyendepaiement,input.tarif,input.remboursement, "")
            res.redirect('/ryu/refmedecin')
        }

    });

    router.route('/refmedecinEdit')
    .post(uploadFixe,[
        check("name","nom Invalide").not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){//ça veut dire s'il y a erreur exécute mois ça
            res.redirect('/ryu/refmedecin')
        }
        else {
            const input = req.body;
            const file = (req.file) ? req.file.filename: input.hideFile;
            const numeroSecond = (input.numeroSecond !== "") ? input.numeroSecond : "";
            const admin = await AdminQuerie.updateMedecin(input.code,input.name,input.numero,input.clinic,input.address,input.specialite, input.pays, 1, file, input.email, numeroSecond, input.debut, input.fin,input.onm,input.moyendepaiement,input.tarif,input.remboursement, "")
            
            res.redirect('/ryu/refmedecin')
        }

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
