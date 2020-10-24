const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.set('view engine', 'pug');

const filmRoutes = require('./routes/film');
const mongoose = require('mongoose');
const path = require('path');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(filmRoutes.routes);

const PORT = process.env.PORT || 3000;

const ConnectionString = 'mongodb+srv://OTY:mahir1453@cluster0.y65b2.mongodb.net/filmbotu?retryWrites=true&w=majority';

mongoose.connect(ConnectionString)
    .then(() => {
        console.log('Connected to mongodb');
        app.listen(PORT);
    })
    .catch(err => { console.log(err) });