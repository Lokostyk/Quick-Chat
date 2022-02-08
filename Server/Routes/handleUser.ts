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
const upload = multer({storage:storage})

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
router.post("/getChats",(req,res)=>{
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
router.patch("/updateUserData",upload.single("data"),async (req,res)=>{
    console.log(req.file);
    if(req.body.name){
        await userModel.updateOne({_id:req.body._id},{name:req.body.name,surname:req.body.surname,email:req.body.email})
        .catch(err=>console.log(err))
    }else if(req.body.password){
        await userModel.updateOne({_id:req.body._id},{password:req.body.password})
    }else if(req.body.img){
        console.log(req.body.img);
    }
})

module.exports = router