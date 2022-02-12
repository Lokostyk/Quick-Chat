export {}
const moongose = require("mongoose")

const ChatShema = new moongose.Schema({
    users: {
        type:Array,
        required:true
    },
    messages: {
        type:Array,
        required:true
    }
},{collection:"Chats"})

const Chat = moongose.model("Chats",ChatShema)

module.exports = Chat