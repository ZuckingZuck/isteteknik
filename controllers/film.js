const Film = require('../models/izlenmisfilmler');
const IzlenecekFilm = require('../models/izlenecekfilmler');
const Quiz = require('../models/quizes');
const User = require('../models/user');
const izlenecekfilmler = require('../models/izlenecekfilmler');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');

exports.getIndex = (req, res, next) => {
    IzlenecekFilm.find().then(izlenecekfilmler => {
        Film.find().then(filmler => {
            res.render("index", {
                title: "- İzlenmis Filmler",
                filmler: filmler,
                izlenecekfilmler: izlenecekfilmler,
                action: req.query.action,
                path: '/anasayfa',
                user: req.user
            });
        });
    });
}

exports.getIzlenmisFilmler = (req, res, next) => {
    Film.find().then(filmler => {
        console.log(filmler);
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

exports.getFilmDetay = (req,res,next) => {
    let filmid = req.params.filmid;

    Film.find({_id: filmid}).then(film => {
        let filim = film[0];

        Quiz.find({film_id: filim._id}).then(quiz => {
            res.render("filmdetay", {
                title: film[0].film + " detay",
                film: film[0],
                quizes: quiz
            })
        })
    })
}

exports.getIzlenecekFilmSil = (req,res,next) => {
    let filmid = req.body.filmid;

    IzlenecekFilm.findOneAndDelete({_id: filmid}).then(result => {
        res.redirect("/izlenecekfilmler");
    });
}


//USER

exports.getLogin = (req, res, next) => {
    res.render('login', {
        path: '/login',
        title: 'Login',
    });
}

exports.postLogin = (req, res, next) => {

    const name = req.body.name;
    const password = req.body.password;

    User.findOne({ name: name })
        .then(user => {
            if (!user) {
                req.session.errorMessage = 'Bu kullanıcı adı ile bir kayıt bulunamadı.';
                req.session.save(function(err) {
                    console.log(err)
                    return res.redirect('/login');
                });
            }

            bcrypt.compare(password, user.password)
                .then(isSucces => {
                    if (isSucces) {
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        return req.session.save(function(err) {
                            var url = req.session.redirectTo || '/';
                            delete req.session.redirectTo;
                            res.redirect(url);
                        })
                    }
                    res.redirect('/')
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch();
}

exports.getRegister =(req,res,render) => {
    res.render("register", {
        title: "Register"
    })
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;

    User.findOne({ name: name })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Bu kullanıcı adı kullanımda.';
                req.session.save(function(err) {
                    console.log(err)
                });
                return res.redirect('/register');
            }
            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            console.log(hashedPassword);
            const newUser = new User({
                name: name,
                password: hashedPassword
            });
            return newUser.save();
        })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}