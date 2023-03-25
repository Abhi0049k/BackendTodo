const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    task: String,
    desc: String,
    pending: String,
    userId: String
},{
    versionKey: false
})

const todoModel = mongoose.model('todo', todoSchema);


module.exports = {
    todoModel
}