const mongoose = require('mongoose');

const izlenenfilmlerSchema = mongoose.Schema({
    film: {
        type: String,
        required: true,
    },
    quizsorgusu: {
        type: Boolean,
        default: false
    },
    puan: {
        type: Number,
        default: -10000
    },
    ratings: {
        type: Object,
    },
    pos: {
        type: Number
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});


module.exports = mongoose.model('izlenenfilmler', izlenenfilmlerSchema);