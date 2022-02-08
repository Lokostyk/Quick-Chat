require("dotenv").config()
const cors = require("cors")
const cloudinary = require("cloudinary")
const moongose = require("mongoose")
const express = require("express")
const app = express()

const registerUserRouter = require("./Routes/handleUser")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(cors())
app.use(express.json())

app.use("/handleUser",registerUserRouter)

moongose.connect(process.env.MONGO_URI,()=>console.log("Connected!"))

app.listen(3000)