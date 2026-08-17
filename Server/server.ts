require("dotenv").config();
const cloudinary = require("cloudinary");
const mongoose = require("mongoose"); // Poprawiona literówka
const express = require("express");
const app = express();
const Pusher = require("pusher"); 
const cors = require("cors");

// Konfiguracja CORS pod Twój frontend
app.use(cors({
    origin: 'https://quickchat777.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.options('*', cors());

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Zamiast "export const", definiujemy to klasycznie
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER
});

// Importing routes
const usersRouter = require("./Routes/handleUser");
const chatRouter = require("./Routes/handleChat");

// middleware
app.use(express.json());

// routes
app.use("/handleUser", usersRouter);
app.use("/handleChat", chatRouter);

// Database
mongoose.connect(process.env.MONGO_URI, () => console.log("Connected to MongoDB!"));

// Server (uruchomi się na porcie 3000 tylko lokalnie na Twoim komputerze)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log("Server running on port 3000"));
}

// NAJWAŻNIEJSZE DLA VERCELA: Eksportujemy aplikację
module.exports = app;

// Jeśli używasz pushera w innych plikach (np. w routerach), to pozwala go zaimportować
module.exports.pusher = pusher;