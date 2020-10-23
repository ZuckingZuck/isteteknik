const mongoose = require('mongoose');

const izlenecekfilmlerSchema = mongoose.Schema({
    film: {
        type: String,
        required: true,
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});


module.exports = mongoose.model('izlenecekfilmler', izlenecekfilmlerSchema);