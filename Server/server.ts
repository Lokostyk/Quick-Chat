require("dotenv").config()
const cors = require("cors")
const cloudinary = require("cloudinary")
const moongose = require("mongoose")
const express = require("express")
const http = require("http")
const app = express()
export const server = http.createServer(app)
app.use(cors())
app.options('*', cors())

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Importing routes
const usersRouter = require("./Routes/handleUser")
const chatRouter = require("./Routes/handleChat")

//middleware
app.use(express.json())

//routes
app.use("/handleUser",usersRouter)
app.use("/handleChat",chatRouter)

//Database
moongose.connect(process.env.MONGO_URI,()=>console.log("Connected!"))

//Server
server.listen(3000)