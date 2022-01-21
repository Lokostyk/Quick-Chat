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

router.post("/",(req,res)=>{
    const newUser = new userModel(req.body)
    try{
        newUser.save()
    }catch (err){
        console.log(err)
    }
})

module.exports = router