require("dotenv").config()
const cors = require("cors")
const moongose = require("mongoose")
const express = require("express")
const app = express()

const registerUserRouter = require("./Routes/handleUser")

app.use(cors())
app.use(express.json())

app.use("/handleUser",registerUserRouter)

moongose.connect(process.env.MONGO_URI,()=>console.log("Connected!"))

app.listen(3000)