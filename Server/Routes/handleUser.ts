export {}
const router = require("express").Router() 
const userModel = require("../Models/userModel")

router.post("/login",async (req,res)=>{
    const userData = await userModel.findOne(req.body)
    try {
        res.send(userData)
    }catch (err){
        console.log(err)
        res.send(err)
    }
})

router.post("/",async (req,res)=>{
    const userData = await userModel.findOne({email:req.body.email})
    //Checking if user already exists
    if(userData){
       res.send("User with this email already exists!") 
    }else{
        const newUser = new userModel(req.body)
        try{
            res.send("Success")
            newUser.save()
        }catch (err){
            console.log(err)
        }
    }
})

router.patch("/updateUserData",async (req,res)=>{
    if(req.body.name){
        await userModel.updateOne({_id:req.body._id},{name:req.body.name,surname:req.body.surname,email:req.body.email})
        .catch(err=>console.log(err))
    }else {
        await userModel.updateOne({_id:req.body._id},{password:req.body.password})
    }
})

module.exports = router