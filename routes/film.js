const express = require('express');
const router = express.Router();
const filmController = require('../controllers/film');

router.get('/', filmController.getIndex);

router.get('/izlenmisfilmler', filmController.getIzlenmisFilmler);

router.post('/film-ekle', filmController.postIndex);

router.use('/delete-film', filmController.postDeleteFilm);

router.get('/izlenecekfilmler', filmController.getIzlenecekler);

router.post('/aktar', filmController.postAktar);

router.post('/filmekle', filmController.postFilmEkle);

router.get('/film/:id', filmController.getFilmDuzenle);

router.post('/filmduzenle', filmController.postFilmDuzenle);

router.post('/quizduzenle', filmController.postQuizDuzenle);

module.exports.routes = router;