const router = require("express").Router();
const userModel = require("../Models/userModel");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_FOLDER_NAME
    }
});
const upload = multer({storage});

router.post("/login", async (req, res) => {
    try {
        const userData = await userModel.findOneAndUpdate(
            { email: req.body.email, password: req.body.password },
            { $set: { authToken: req.body.authToken } }
        );
        res.send(userData);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/tokenAuthentication", async (req, res) => {
    try {
        const userData = await userModel.findOne({ authToken: req.body.authToken });
        res.send(userData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Authentication failed" });
    }
});

// Getting users/groups chats
router.post("/getUsers", async (req, res) => {
    try {
        if (req.body.joinedChats) {
            const users = await userModel.find(
                { _id: { $in: req.body.joinedChats } },
                { password: 0, email: 0, imgBig: 0, joinedChats: 0, authToken: 0 }
            );
            res.send(users);
        } else {
            const users = await userModel.find(
                {},
                { password: 0, email: 0, imgBig: 0, joinedChats: 0, authToken: 0 }
            );
            res.send(users);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to fetch users" });
    }
});

router.post("/getUserById", async (req, res) => {
    try {
        const userData = await userModel.findOne(
            { _id: req.body.id },
            { password: 0, email: 0, imgBig: 0, authToken: 0 }
        );
        res.send(userData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to fetch user" });
    }
});

router.post("/getUsersByIds", async (req, res) => {
    try {
        const usersData = await userModel.find(
            { _id: { $in: req.body } },
            { password: 0, email: 0, imgBig: 0, authToken: 0 }
        );
        res.send(usersData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to fetch users" });
    }
});

// Creating account & changing email
router.post("/", async (req, res) => {
    try {
        const userData = await userModel.findOne({ email: req.body.email });
        
        // Checking if user already exists
        if (userData) {
            return res.send("User with this email already exists!");
        } 
        
        const newUser = new userModel(req.body);
        
        if (req.body.changeEmail) {
            await userModel.updateOne({ _id: req.body._id }, { email: req.body.email });
        } else {
            await newUser.save();
        }
        res.send("Success");
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Account creation failed" });
    }
});

router.patch("/updateUserData", upload.single("avatar"), async (req, res) => {
    try {
        if (req.body.name) {
            await userModel.updateOne(
                { _id: req.body._id },
                { name: req.body.name, surname: req.body.surname, email: req.body.email }
            );
            res.send("User data updated");
        } else if (req.body.password) {
            await userModel.updateOne(
                { _id: req.body._id },
                { password: req.body.password }
            );
            res.send("Password updated");
        } else if (req.file) {
            const imgPath = req.file.path;
            const imgSmall = imgPath.slice(0, imgPath.indexOf("upload/") + 7) + "w_auto,h_90,c_scale,q_90/" + imgPath.slice(imgPath.indexOf("upload/") + 7);
            const imgBig = imgPath.slice(0, imgPath.indexOf("upload/") + 7) + "w_auto,h_350,c_scale,q_90/" + imgPath.slice(imgPath.indexOf("upload/") + 7);
            
            await userModel.updateOne({ _id: req.body._id }, { imgSmall, imgBig });
            res.send({ imgSmall, imgBig });
        } else {
            res.status(400).send("No valid data provided for update");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to update user data" });
    }
});

module.exports = router;