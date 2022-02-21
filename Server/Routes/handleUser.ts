export {}
const router = require("express").Router() 
const userModel = require("../Models/userModel")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require("multer")

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder: "QuickChat"
    }
})
const upload = multer({storage})

router.post("/login",async (req,res)=>{
    const userData = await userModel.findOne(req.body)
    try {
        res.send(userData)
    }catch (err){
        console.log(err)
        res.send(err)
    }
})
//Getting single users/groups
router.post("/getUsers",async (req,res)=>{
    try{
        if(req.body.joinedChats){
            const users = await userModel.find({_id:{$in:req.body.joinedChats}},{password:0,email:0,imgBig:0,joinedChats:0})
            res.send(users)
        }else {
            const users = await userModel.find({},{password:0,email:0,imgBig:0,joinedChats:0})
            res.send(users)
        }
    }catch (err){
        console.log(err)
    }
})
router.post("/getUserById",async (req,res)=>{
    const userData = await userModel.findOne({_id:req.body.id},{password:0,email:0,imgBig:0,joinedChats:0})
    try {
        res.send(userData)
    }catch (err){
        console.log(err)
    }
})
//Creating account & changing email
router.post("/",async (req,res)=>{
    const userData = await userModel.findOne({email:req.body.email})
    //Checking if user already exists
    if(userData){
       res.send("User with this email already exists!") 
    }else{
        const newUser = new userModel(req.body)
        try{
            res.send("Success")
            if(req.body.changeEmail){
                await userModel.updateOne({_id:req.body._id},{email:req.body.email})
            }else {
                newUser.save()
            }
        }catch (err){
            console.log(err)
        }
    }
})
router.patch("/updateUserData",upload.single("avatar"),async (req,res)=>{
    if(req.body.name){
        await userModel.updateOne({_id:req.body._id},{name:req.body.name,surname:req.body.surname,email:req.body.email})
        .catch(err=>console.log(err))
    }else if(req.body.password){
        await userModel.updateOne({_id:req.body._id},{password:req.body.password})
    }else if(req.file){
        const imgPath = req.file.path 
        const imgSmall = imgPath.slice(0,imgPath.indexOf("upload/")+7) + "w_auto,h_90,c_scale,q_90/" + imgPath.slice(imgPath.indexOf("upload/")+7)
        const imgBig = imgPath.slice(0,imgPath.indexOf("upload/")+7) + "w_auto,h_350,c_scale,q_90/" + imgPath.slice(imgPath.indexOf("upload/")+7)
        await userModel.updateOne({_id:req.body._id},{imgSmall,imgBig})
        res.send({imgSmall,imgBig})
    }
})

module.exports = router