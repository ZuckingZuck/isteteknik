const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const filmRoutes = require('./routes/film');


app.set('view engine', 'pug');


const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);


app.use(bodyParser.urlencoded({ extended: false }));




const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;

const User = require('./models/User');


const ConnectionString = 'mongodb+srv://OTY:mahir1453@cluster0.y65b2.mongodb.net/filmbotu?retryWrites=true&w=majority';

var store = new mongoDbStore({
    uri: ConnectionString,
    collection: 'mySessions'
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            console.log(req.user);
            next();
        })
        .catch(err => { console.log(err) });
})

app.use(filmRoutes.routes);



mongoose.connect(ConnectionString)
    .then(() => {
        console.log('Connected to mongodb');
        app.listen(PORT);
    })
    .catch(err => { console.log(err) });