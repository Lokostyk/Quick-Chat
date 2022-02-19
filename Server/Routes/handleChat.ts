export {}
const router = require("express").Router()
const chatModel = require("../Models/chatModel")
const userModel = require("../Models/userModel")

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
            const newGroupList = await chatModel.find({isPrivate:false})
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
            const singleChat = await chatModel.findOne({groupName:null,$set:{users:[req.body.userOneId,req.body.userTwoId]}})
            res.send(singleChat)
        }else {
            const groupChat = await chatModel.findOne({_id:req.body.userOneId})
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

module.exports = router