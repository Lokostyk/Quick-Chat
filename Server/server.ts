require("dotenv").config();
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Pusher = require("pusher"); 
const cors = require("cors");

// 1. Zabezpieczamy eksport aplikacji NA SAMYM POCZĄTKU
module.exports = app;

// Konfiguracja CORS pod Twój frontend
app.use(cors({
    origin: 'https://quickchat777.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.options('*', cors());

// Konfiguracja Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Inicjalizacja Pushera
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER
});

// 2. Eksportujemy Pushera zanim załadujemy trasy, by usunąć błąd "Circular dependency"
module.exports.pusher = pusher;

// 3. DOPIERO TERAZ ładujemy routery (mają już dostęp do wyeksportowanego pushera)
const usersRouter = require("./Routes/handleUser");
const chatRouter = require("./Routes/handleChat");

// Middleware
app.use(express.json());

// Routes
app.use("/handleUser", usersRouter);
app.use("/handleChat", chatRouter);

// 4. Poprawione łączenie z bazą danych (bez starego callbacka)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Serwer działa lokalnie na porcie 3000 (pomijane na Vercelu)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log("Server running on port 3000"));
}