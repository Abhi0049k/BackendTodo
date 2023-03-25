const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, unique: true},
    role: String,
    age: Number,
    password: String
},{
    versionKey: false
})

const userModel = mongoose.model('user', userSchema);


module.exports = {
    userModel
}