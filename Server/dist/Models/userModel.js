"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moongose = require("mongoose");
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
    },
    imgSmall: {
        type: String
    },
    imgBig: {
        type: String
    },
    joinedChats: {
        type: Array,
        required: true
    },
    authToken: {
        type: String
    }
}, { collection: "UserData" });
const User = moongose.model("UserData", userSchema);
module.exports = User;
//# sourceMappingURL=userModel.js.map