const express = require('express');
const router = express.Router();
const filmController = require('../controllers/film');
const isAuthenticated = require('../middleware/authentication');
const auth = require('../middleware/auth');

router.get('/',auth, filmController.getIndex);

router.get('/izlenmisfilmler',auth, isAuthenticated, filmController.getIzlenmisFilmler);

router.post('/film-ekle',auth, filmController.postIndex);

router.use('/delete-film',auth, filmController.postDeleteFilm);

router.get('/izlenecekfilmler',auth, filmController.getIzlenecekler);

router.post('/aktar',auth, filmController.postAktar);

router.post('/filmekle',auth, filmController.postFilmEkle);

router.get('/film/:id',auth, filmController.getFilmDuzenle);

router.post('/filmduzenle',auth, filmController.postFilmDuzenle);

router.post('/quizduzenle',auth, filmController.postQuizDuzenle);

router.get('/filmdetay/:filmid',auth, filmController.getFilmDetay);

router.post("/izlenecekfilmsil", auth, filmController.getIzlenecekFilmSil);

router.get("/izlenecekfilmdetay/:filmid", auth, filmController.getIzlenecekFilmDetay);

//USER

router.get('/login',auth, filmController.getLogin);

router.post('/login',auth, filmController.postLogin);


router.get('/register',auth, filmController.getRegister);

router.post('/register',auth, filmController.postRegister);


router.get('/logout', auth, filmController.getLogout);

//Oneri
router.get("/filmoner", auth, filmController.getFilmOner);

module.exports.routes = router;