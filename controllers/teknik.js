const YapilmisIs = require('../models/yapilmisisler');
const YapilacakIs = require('../models/yapilacakisler');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');



exports.getIndex = (req, res, next) => {

   
        YapilmisIs.find().then(YapilmisIsler => {
            res.render("index", {
                title: "- YapilmisIsler",
                YapilmisIsler: YapilmisIsler,
                action: req.query.action,
                path: '/',
                user: req.user
            });
        });
}

exports.getYapilmisIsler = (req, res, next) => {
    YapilmisIs.find().then(YapilmisIsler => {
        console.log(YapilmisIsler);
        res.render("YapilmisIsler", {
            title: "- İzlenmis YapilmisIsler",
            YapilmisIsler: YapilmisIsler,
            action: req.query.action,
            path: '/izlenmisYapilmisIsler'
        })
    })
}


exports.postDeleteYapilmisIs = (req, res, next) => {
    let id = req.body.id;
    YapilmisIs.findByIdAndDelete(id).then(result => {
        
        }).then(result => {
            res.redirect('/tamamlanmis?action=delete');
        });

}

exports.getYapilacaklar = (req, res, next) => {
    YapilacakIs.find().then(YapilmisIsler => {
        res.render('YapilacakIsler', {
            title: "- YapilmisIsler",
            YapilmisIsler: YapilmisIsler,
            action: req.query.action,
            path: '/YapilacakIsler'
        })
    })
}

exports.getJson = (req,res,next) => {
    YapilacakIs.find().then(YapilmisIs => {
        res.status(200).json(YapilmisIs);
    })
}

exports.postAktar = (req, res, next) => {
    let yapilacakisid = req.body.id;

    YapilacakIs.findOne({yapilacakisid}).then(result => {
        console.log(result);

        let yapilmisis = new YapilmisIs({kasa: result.kasa, anakart: result.anakart, yapilmisis: result.yapilacakis, talepeden: result.talepeden, teslimalan: result.teslimalan});
        yapilmisis.save();
        
        result.delete();
    })
   
    // let YapilmisIs = new YapilmisIs({});
    // YapilmisIs.save();

    

}

exports.postYapilmisIsEkle = (req, res, next) => {
    let kasa = req.body.kasa;
    let anakart = req.body.anakart;
    let yapilmisis = req.body.yapilmisis;
    let talepeden = req.body.talepeden;
    let teslimalan = req.user.name;

    let yapilmisisekle = new YapilmisIs({kasa: kasa, anakart: anakart, yapilmisis: yapilmisis, talepeden: talepeden, teslimalan, teslimalan});
    yapilmisisekle.save().then(result => {res.redirect("/tamamlanmis")});
    //YapilacakIsEkle.save().then(result => {res.redirect("/admin/search?action=yapilacakiseklendi")});


}

exports.getYapilmisIsDuzenle = (req, res, next) => {
    let YapilmisIsid = req.params.id;

    YapilmisIs.find({ _id: YapilmisIsid }).then(YapilmisIs => {
        let filim = YapilmisIs[0];
        Quiz.find({ YapilmisIs_id: filim._id }).then(quiz => {
            res.render('YapilmisIsduzenle', {
                title: "YapilmisIs Düzenle",
                YapilmisIs: YapilmisIs[0],
                quizes: quiz
            })
        })
    })
}

exports.postYapilmisIsDuzenle = (req, res, next) => {
    let YapilmisIsadi = req.body.YapilmisIsadi;
    let YapilmisIspos = req.body.YapilmisIspos;
    let id = req.body.YapilmisIsid;

    YapilmisIs.findOneAndUpdate({ _id: id }, { YapilmisIs: YapilmisIsadi, pos: YapilmisIspos }).then(result => {
        res.redirect('/admin/YapilmisIsler?action=duzenlendi');
    })
}


exports.getYapilacakIsSil = (req,res,next) => {
    let YapilacakIsid = req.body.id;

    YapilacakIs.findOneAndDelete({_id: YapilacakIsid}).then(result => {
        res.redirect("/admin/YapilacakIsler?action=delete");
    });
}


//USER

exports.getLogin = (req, res, next) => {
    res.render('loginv2', {
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
    res.render("registerv2", {
        title: "Register",
        path: "/register"
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
                password: hashedPassword,
            });

            newUser.save();
            return res.redirect('/login');

        })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}


exports.getAdmin = (req,res,next) => {
    YapilacakIs.find().then(YapilacakIsler => {
        YapilmisIs.find().then(YapilmisIsler => {
            let total = 0;
            YapilmisIsler.map(YapilmisIs => {
                total += YapilmisIs.puan;
            })
            let ortalama = Math.round(total/YapilmisIsler.length);
            console.log(ortalama);
            User.find().then(users=> {
                res.render("admin/admin-dashboard", {
                    title: "Admin",
                    YapilmisIsler: YapilmisIsler,
                    YapilacakIsler: YapilacakIsler,
                    action: req.query.action,
                    path: '/dashboard',
                    users: users,
                    user: req.user,
                    dcuser: req.dcuser,
                    ortalama: ortalama
                });
            })
        });
    });
}

exports.getAdminUsers = (req,res,next) => {
    User.find().then(users => {
        res.render("admin/admin-users", {
            title: "Users",
            path: "/users",
            user: req.user,
            action: req.query.action,
            dcuser: req.dcuser,
            users: users
        })
    })
}

exports.getAdminProfile = (req,res,next) => {
    
    User.findOne({_id: req.user._id}).then(user => {
        Quiz.find({author: user.name}).then(quizes => {
            oneriYapilmisIsler.find({user_dc_id: user.dc_id}).then(oneriYapilmisIsler => {
                favYapilmisIsler.find({user_dc_id: user.dc_id}).then(favYapilmisIsler => {
                    res.render("admin/admin-profil", {
                        title: "Profil",
                        user: req.user,
                        path: "/profil",
                        action: req.query.action,
                        quizes: quizes,
                        dcuser: req.dcuser,
                        oneriYapilmisIsler: oneriYapilmisIsler,
                        favYapilmisIsler: favYapilmisIsler
                    })
                })
            })
        });
    })
}

exports.getAdminIzlenmis = (req,res,next) => {

    YapilmisIs.find().then(YapilmisIsler => {
        res.render("admin/admin-izlenmis", {
            title: "İzlenmiş YapilmisIsler",
            user: req.user,
            path: "/izlenmis",
            YapilmisIsler: YapilmisIsler,
            action: req.query.action,
            dcuser: req.dcuser,
        })
    })
}

exports.getAdminIzlenecek = (req,res,next) => {
    YapilacakIs.find().then(YapilacakIsler => {
        res.render("admin/admin-izlenecek", {
            title: "İzlenecek YapilmisIsler",
            user: req.user,
            path: "/izlenecek",
            YapilacakIsler: YapilacakIsler,
            action: req.query.action,
            dcuser: req.dcuser,
        })
    })
}

exports.getAdminSearch = (req,res,next) => {
    res.render("admin/admin-search", {
        title: "YapilmisIs Ara",
        user: req.user,
        path: "/search",
        action: req.query.action,
        dcuser: req.dcuser,
    })
}

exports.getAdminIzlenecekDuzenle = (req,res,next) => {
    let YapilmisIsid = req.params.id;

    YapilmisIs.find({ _id: YapilmisIsid }).then(YapilmisIs => {
        let filim = YapilmisIs[0];
        Quiz.find({ YapilmisIs_id: filim._id }).then(quiz => {
            res.render('admin/admin-izlenecek-duzenle', {
                title: "YapilmisIs Düzenle",
                YapilmisIs: YapilmisIs[0],
                quizes: quiz,
                user: req.user,
                dcuser: req.dcuser,
            })
        })
    })    
}
