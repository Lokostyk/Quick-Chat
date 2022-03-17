"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const { pusher } = require("../server");
const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");
router.post("/sendMessage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleMessages(req.body.message, req.body.chatId);
}));
router.post("/createSingle", (req, res) => {
    const newChat = new chatModel({ users: [req.body.userOneId, req.body.userTwoId], messages: [] });
    try {
        newChat.save()
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield userModel.updateOne({ _id: req.body.userOneId }, { $push: { joinedChats: req.body.userTwoId } });
            yield userModel.updateOne({ _id: req.body.userTwoId }, { $push: { joinedChats: req.body.userOneId } });
        }));
    }
    catch (err) {
        console.log(err);
    }
});
router.post("/createGroup", (req, res) => {
    const newChat = new chatModel({ groupName: req.body.groupName, users: [req.body.userOneId], messages: [], isPrivate: req.body.isPrivate });
    try {
        newChat.save()
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield userModel.updateOne({ _id: req.body.userOneId }, { $push: { joinedChats: newChat._id } });
        }));
    }
    catch (err) {
        console.log(err);
    }
});
//Getting all groups without private in Search window
router.post("/getGroups", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.joinedGroups) {
            const newGroupList = yield chatModel.find({ _id: { $in: req.body.joinedGroups } });
            res.send(newGroupList);
        }
        else {
            const newGroupList = yield chatModel.find({ isPrivate: false }, { messages: 0 });
            res.send(newGroupList);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
//Get chat with all messages
router.post("/getChat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //If userTwoId is empty it will search for group chat
        if (req.body.userTwoId) {
            const singleChat = yield chatModel.findOne({ groupName: null, $set: { users: [req.body.userOneId, req.body.userTwoId] } }, { messages: 0 });
            res.send(singleChat);
        }
        else {
            const groupChat = yield chatModel.findOne({ _id: req.body.userOneId }, { messages: 0 });
            res.send(groupChat);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
router.post("/joinGroup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatModel.updateOne({ _id: req.body.groupId }, { $push: { users: req.body.userId } });
        yield userModel.updateOne({ _id: req.body.userId }, { $push: { joinedChats: req.body.groupId } });
    }
    catch (err) {
        console.log(err);
    }
}));
router.post("/addUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatModel.findOneAndUpdate({ _id: req.body.chatId }, { $push: { users: req.body.userId } });
        yield userModel.findOneAndUpdate({ _id: req.body.userId }, { $push: { joinedChats: req.body.chatId } });
    }
    catch (err) {
        console.log(err);
    }
}));
router.post("/kickUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.updateOne({ _id: req.body.userId }, { $pull: { joinedChats: req.body.chatId } });
    }
    catch (err) {
        console.log(err);
    }
}));
router.post("/getMoreMessages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moreMessages = yield chatModel.findOne({ _id: req.body.id }, { messages: { $slice: [req.body.howMany, 20] }, _id: 0, users: 0, groupName: 0, isPrivate: 0 });
    try {
        res.send(moreMessages);
    }
    catch (err) {
        console.log(err);
    }
}));
const handleMessages = (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatModel.findOneAndUpdate({ _id: chatId }, { $push: { messages: { $each: [message], $position: 0 } } });
        pusher.trigger(chatId, "message", message);
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = router;
//# sourceMappingURL=handleChat.js.map