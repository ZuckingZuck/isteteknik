const mongoose = require('mongoose');

const yapilanIslerSchema = mongoose.Schema({
    kasa: {
        type: String,
        required: true,
    },
    anakart: {
        type: String,
    },
    yapilmisis: {
        type: String,
    },
    talepeden: {
        type: String,
    },
    teslimalan: {
        type: String,
        required: true
    },
    tarih: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});


module.exports = mongoose.model('yapilanis', yapilanIslerSchema);