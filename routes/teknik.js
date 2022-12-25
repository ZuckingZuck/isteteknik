const express = require('express');
const router = express.Router();
const isteController = require('../controllers/teknik');
const isAuthenticated = require('../middleware/authentication');
const isAdmin = require('../middleware/admin');

router.get('/', isteController.getIndex);

router.get('/tamamlanmis', isAuthenticated,isAdmin, isteController.getYapilmisIsler);

//router.post('/film-ekle',auth, isteController.postIndex);

router.use('/yapilmisissil',isAdmin, isteController.postDeleteYapilmisIs);

router.get('/yapilacak',isAdmin, isteController.getYapilacaklar);

router.post('/aktar',isAdmin, isteController.postAktar);

//router.post('/yapilacakisekle',isAdmin, isteController.postYapilacakIsEkle);

router.post('/yapilmisisekle', isteController.postYapilmisIsEkle);

router.get('/tamamlanmis/:id',isAdmin, isteController.getYapilmisIsDuzenle);

router.post('/tamamlanmis',isAdmin, isteController.postYapilmisIsDuzenle);



router.post("/yapilacakissil", isAdmin, isteController.getYapilacakIsSil);


//router.get("/getjson", auth, isteController.getJson);

//USER

router.get('/login', isteController.getLogin);

router.post('/login', isteController.postLogin);


router.get('/register', isteController.getRegister);

router.post('/register', isteController.postRegister);


router.get('/logout', isAuthenticated, isteController.getLogout);


//Admin

router.get("/admin", isAdmin, isAuthenticated, isteController.getAdmin);

router.get("/admin/users", isAdmin, isAuthenticated, isteController.getAdminUsers);

router.get("/admin/profile", isAdmin, isAuthenticated, isteController.getAdminProfile);

router.get("/admin/tamamlanmis", isAdmin, isAuthenticated, isteController.getAdminIzlenmis);

router.get("/admin/yapilacak", isAdmin, isAuthenticated, isteController.getAdminIzlenecek);

router.get("/admin/tamamlanmis/:id", isAdmin, isAuthenticated, isteController.getAdminIzlenecekDuzenle);


module.exports.routes = router;