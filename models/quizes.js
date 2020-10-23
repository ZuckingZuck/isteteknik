const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    film_id: {
        type: ObjectID,
        required: true,
    },
    content: {
        type: String
    },
    author: {
        type: String
    }


}, {
    versionKey: false // You should be aware of the outcome after set to false
});


module.exports = mongoose.model('quize', quizSchema);