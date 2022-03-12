export {}
const router = require("express").Router()
const {pusher} = require("../server")

const chatModel = require("../Models/chatModel")
const userModel = require("../Models/userModel")

router.post("/sendMessage",async (req,res)=>{
    handleMessages(req.body.message,req.body.chatId)
})
router.post("/createSingle",(req,res)=>{
    const newChat = new chatModel({users:[req.body.userOneId,req.body.userTwoId],messages:[]})
    try {
        newChat.save()
        .then(async()=>{
            await userModel.updateOne({_id:req.body.userOneId},{$push:{joinedChats:req.body.userTwoId}})
            await userModel.updateOne({_id:req.body.userTwoId},{$push:{joinedChats:req.body.userOneId}})         
        })
    }catch (err){
        console.log(err)
    }
})
router.post("/createGroup",(req,res)=>{
    const newChat = new chatModel({groupName:req.body.groupName,users:[req.body.userOneId],messages:[],isPrivate:req.body.isPrivate})
    try{
        newChat.save()
        .then(async()=>{
            await userModel.updateOne({_id:req.body.userOneId},{$push:{joinedChats:newChat._id}})
        })
    }catch (err){
        console.log(err)
    }
})
//Getting all groups without private in Search window
router.post("/getGroups",async (req,res)=>{
    try {
        if(req.body.joinedGroups){
            const newGroupList = await chatModel.find({_id:{$in:req.body.joinedGroups}})
            res.send(newGroupList)
        }else {
            const newGroupList = await chatModel.find({isPrivate:false},{messages:0})
            res.send(newGroupList)
        }
    }catch (err){
        console.log(err)
    }
})
//Get chat with all messages
router.post("/getChat",async(req,res)=>{
    try{
        //If userTwoId is empty it will search for group chat
        if(req.body.userTwoId){
            const singleChat = await chatModel.findOne({groupName:null,$set:{users:[req.body.userOneId,req.body.userTwoId]}},{messages:0})
            res.send(singleChat)
        }else {
            const groupChat = await chatModel.findOne({_id:req.body.userOneId},{messages:0})
            res.send(groupChat)
        }
    }catch (err){
        console.log(err)
    }
})
router.post("/joinGroup",async (req,res)=>{
    try{
        await chatModel.updateOne({_id:req.body.groupId},{$push:{users:req.body.userId}})
        await userModel.updateOne({_id:req.body.userId},{$push:{joinedChats:req.body.groupId}})
    }catch (err){
        console.log(err)
    }
})
router.post("/addUser",async(req,res)=>{
    try {
        console.log(req.body)
    }catch (err){
        console.log(err)
    }
})
router.post("/kickUser",async (req,res)=>{
    try{
        await userModel.updateOne({_id:req.body.userId},{$pull:{joinedChats:req.body.chatId}})
    }catch (err){
        console.log(err)
    }
})
router.post("/getMoreMessages",async (req,res)=>{
    const moreMessages = await chatModel.findOne({_id:req.body.id},{messages:{$slice:[req.body.howMany,20]},_id:0,users:0,groupName:0,isPrivate:0})
    try {
        res.send(moreMessages)
    }catch (err){
        console.log(err)
    }
})

const handleMessages = async (message,chatId) => {
    try{
        await chatModel.findOneAndUpdate({_id:chatId},{$push:{messages:{$each:[message],$position:0}}})
        pusher.trigger(chatId,"message",message)
    }catch (err){
        console.log(err)
    }
}

module.exports = router