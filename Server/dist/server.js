"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pusher = void 0;
require("dotenv").config();
const cloudinary = require("cloudinary");
const moongose = require("mongoose");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const Pusher = require("pusher");
const cors = require("cors");
app.use(cors());
app.options('*', cors());
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.pusher = new Pusher({
    "appId": process.env.PUSHER_APP_ID,
    "key": process.env.PUSHER_KEY,
    "secret": process.env.PUSHER_SECRET,
    "cluster": process.env.PUSHER_CLUSTER
});
//Importing routes
const usersRouter = require("./Routes/handleUser");
const chatRouter = require("./Routes/handleChat");
//middleware
app.use(express.json());
//routes
app.use("/handleUser", usersRouter);
app.use("/handleChat", chatRouter);
//Database
moongose.connect(process.env.MONGO_URI, () => console.log("Connected!"));
//Server
server.listen(3000);
//# sourceMappingURL=server.js.map