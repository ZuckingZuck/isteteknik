const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require("dotenv");

const filmRoutes = require('./routes/teknik');

dotenv.config();
app.set('view engine', 'pug');


const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));




const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;

const User = require('./models/user');


const ConnectionString = 'mongodb+srv://mahir:mahir1453@cluster0.jvxj5iv.mongodb.net/?retryWrites=true&w=majority';

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
                next();
        })
        .catch(err => { console.log(err) });
})

app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }

    
    res.locals.isAuthenticated = req.session.isAuthenticated;
    next();
    
})



app.use(filmRoutes.routes);

app.use(cors());

mongoose.connect(ConnectionString, ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
}))
    .then(() => {
        console.log('Connected to mongodb');
        console.log("Runs at" + port);
        app.listen(port);
    })
    .catch(err => { console.log(err) });