const mongoose = require('mongoose');

const yapilacakIslerSchema = mongoose.Schema({
    kasa: {
        type: String,
        required: true,
    },
    anakart: {
        type: String,
    },
    yapilacakis: {
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


module.exports = mongoose.model('yapilacakisler', yapilacakIslerSchema);