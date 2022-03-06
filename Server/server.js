"use strict";
exports.__esModule = true;
exports.server = void 0;
require("dotenv").config();
var cors = require("cors");
var cloudinary = require("cloudinary");
var moongose = require("mongoose");
var express = require("express");
var http = require("http");
var app = express();
exports.server = http.createServer(app);
var usersRouter = require("./Routes/handleUser");
var chatRouter = require("./Routes/handleChat");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(cors());
app.use(express.json());
app.use("/handleUser", usersRouter);
app.use("/handleChat", chatRouter);
moongose.connect(process.env.MONGO_URI, function () { return console.log("Connected!"); });
exports.server.listen(3000);
