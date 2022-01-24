export {}
const moongose = require("mongoose")

const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{collection:"UserData"})

const User = moongose.model("UserData",userSchema)

module.exports = User