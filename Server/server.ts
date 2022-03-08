require("dotenv").config()
const cors = require("cors")
const allowCors = require('./Config/vercelCORS')
const cloudinary = require("cloudinary")
const moongose = require("mongoose")
const express = require("express")
const http = require("http")
const app = express()
export const server = http.createServer(app)

const usersRouter = require("./Routes/handleUser")
const chatRouter = require("./Routes/handleChat")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(allowCors())
app.use(cors({
    origin:["https://quickchat777.netlify.app"],
    credentials:true
}))

app.use(express.json())

app.use("/handleUser",usersRouter)
app.use("/handleChat",chatRouter)

moongose.connect(process.env.MONGO_URI,()=>console.log("Connected!"))

server.listen(3000)