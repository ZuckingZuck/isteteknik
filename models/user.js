const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Kullanıcı"
    },
    password: {
        type: String,
        required: true
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});


module.exports = mongoose.model('User', userSchema);