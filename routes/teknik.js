const express = require('express');
const router = express.Router();
const filmController = require('../controllers/teknik');
const isAuthenticated = require('../middleware/authentication');
const isAdmin = require('../middleware/admin');

router.get('/', filmController.getIndex);

router.get('/tamamlanmis', isAuthenticated,isAdmin, filmController.getYapilmisIsler);

//router.post('/film-ekle',auth, filmController.postIndex);

router.use('/yapilmisissil',isAdmin, filmController.postDeleteYapilmisIs);

router.get('/yapilacak',isAdmin, filmController.getYapilacaklar);

router.post('/aktar',isAdmin, filmController.postAktar);

//router.post('/yapilacakisekle',isAdmin, filmController.postYapilacakIsEkle);

router.post('/yapilmisisekle', filmController.postYapilmisIsEkle);

router.get('/tamamlanmis/:id',isAdmin, filmController.getYapilmisIsDuzenle);

router.post('/tamamlanmis',isAdmin, filmController.postYapilmisIsDuzenle);



router.post("/yapilacakissil", isAdmin, filmController.getYapilacakIsSil);


//router.get("/getjson", auth, filmController.getJson);

//USER

router.get('/login', filmController.getLogin);

router.post('/login', filmController.postLogin);


router.get('/register', filmController.getRegister);

router.post('/register', filmController.postRegister);


router.get('/logout', isAuthenticated, filmController.getLogout);


//Admin

router.get("/admin", isAdmin, isAuthenticated, filmController.getAdmin);

router.get("/admin/users", isAdmin, isAuthenticated, filmController.getAdminUsers);

router.get("/admin/profile", isAdmin, isAuthenticated, filmController.getAdminProfile);

router.get("/admin/tamamlanmis", isAdmin, isAuthenticated, filmController.getAdminIzlenmis);

router.get("/admin/yapilacak", isAdmin, isAuthenticated, filmController.getAdminIzlenecek);

router.get("/admin/tamamlanmis/:id", isAdmin, isAuthenticated, filmController.getAdminIzlenecekDuzenle);


module.exports.routes = router;