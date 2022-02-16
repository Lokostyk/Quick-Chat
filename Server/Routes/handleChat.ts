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

module.exports = router