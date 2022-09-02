const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const photo = require("./models/Photo");

const app = express();

// Connect DB
mongoose.connect("mongodb://localhost:/pcatDB");

//MIDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method"));

// TEMPLATE ENGINE
app.set("view engine", "ejs");

//ROUTES
app.get("/", async (req, res) => {
    const photos = await photo.find({}).sort("-dateCreated");
    res.render("index", {
        photos
    });
});

app.get("/photos/:id", async (req, res) => {
    const Photo = await photo.findById(req.params.id);
    res.render("photo", {
        Photo
    })
});

app.get("/photos/edit/:id", async (req, res) => {
    const Photo = await photo.findById(req.params.id);
    res.render("edit", {
        Photo
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/post", async (req, res) => {

    const uploadDir = "public/uploads";
    if(!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    } 

    let uploadedImage = req.files.photo;
    let uploadPath = __dirname + "/public/uploads/" + uploadedImage.name;

    uploadedImage.mv(uploadPath, async() => {
        await photo.create({
            ...req.body,
            image: "/uploads/" + uploadedImage.name
        });
        res.redirect("/");
    });
});

app.put("/photos/:id", async(req, res) => {
    const Photo = await photo.findById(req.params.id);
    Photo.title = req.body.title;
    Photo.description = req.body.description;
    Photo.save();

    res.redirect(`/photos/${req.params.id}`);
});

const port = 3000;

app.listen(port, () => console.log(`Sunucu ${port} portunda çalıştı.`));