const Film = require('../models/izlenmisfilmler');
const IzlenecekFilm = require('../models/izlenecekfilmler');
const Quiz = require('../models/quizes');

exports.getIndex = (req, res, next) => {
    res.render("index", {
        path: '/'
    });
}

exports.getIzlenmisFilmler = (req, res, next) => {
    Film.find().then(filmler => {
        res.render("izlenmisfilmler", {
            title: "- İzlenmis Filmler",
            filmler: filmler,
            action: req.query.action,
            path: '/izlenmisfilmler'
        })
    })
}

exports.postIndex = (req, res, next) => {

}

exports.postDeleteFilm = (req, res, next) => {
    let id = req.body.filmid;
    Film.findByIdAndDelete(id).then(result => {
        Film.find().then(filmler => {
            let start = 0;
            filmler.forEach(element => {
                start++;
                element.update({ pos: start }, function() {
                    console.log('Tamamlandı');
                });
            });
        }).then(result => {
            res.redirect('/izlenmisfilmler?action=delete');
        });
    });

}

exports.getIzlenecekler = (req, res, next) => {
    IzlenecekFilm.find().then(filmler => {
        res.render('izlenecekfilmler', {
            title: "- İzlenecek Filmler",
            filmler: filmler,
            action: req.query.action,
            path: '/izlenecekfilmler'
        })
    })
}

exports.postAktar = (req, res, next) => {
    let filmadi = req.body.filmadi;
    let filmid = req.body.filmid;
    Film.find().then(filmler => {

        Film.findOne({ pos: filmler.length }).then(sonfilm => {
            console.log(sonfilm.pos);
            let film = new Film({ film: filmadi, pos: sonfilm.pos + 1 });
            film.save();
            console.log(filmid);
        })


        IzlenecekFilm.findByIdAndDelete(filmid).then(result => {
            res.redirect('/izlenecekfilmler?action=aktarildi');
        })
    })

}

exports.postFilmEkle = (req, res, next) => {
    let filmadi = req.body.filmadi;

    let filim = new IzlenecekFilm({ film: filmadi });
    console.log(filmadi);
    filim.save().then(result => {
        res.redirect('/izlenecekfilmler');
    });

}

exports.getFilmDuzenle = (req, res, next) => {
    let filmid = req.params.id;

    Film.find({ _id: filmid }).then(film => {
        let filim = film[0];
        Quiz.find({ film_id: filim._id }).then(quiz => {
            res.render('filmduzenle', {
                title: "Film Düzenle",
                film: film[0],
                quizes: quiz
            })
        })
    })
}

exports.postFilmDuzenle = (req, res, next) => {
    let filmadi = req.body.filmadi;
    let filmpos = req.body.filmpos;
    let filmpuan = req.body.filmpuan;
    let id = req.body.filmid;

    Film.findOneAndUpdate({ _id: id }, { film: filmadi, pos: filmpos, puan: filmpuan }).then(result => {
        res.redirect('/izlenmisfilmler?action=duzenlendi');
    })
}

exports.postQuizDuzenle = (req, res, next) => {
    let quizcontent = req.body.quizcontent;
    let quizauthor = req.body.quizauthor;
    let id = req.body.quizid;

    Quiz.findOneAndUpdate({ _id: id }, { content: quizcontent, author: quizauthor }).then(result => {
        res.redirect('/izlenmisfilmler?action=duzenlendi');
    })
}