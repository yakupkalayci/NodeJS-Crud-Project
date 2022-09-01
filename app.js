const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const photo = require("./models/Photo");

const app = express();

// Connect DB
mongoose.connect("mongodb://localhost:/pcatDB");

//MIDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// TEMPLATE ENGINE
app.set("view engine", "ejs");

//ROUTES
app.get("/", async (req, res) => {
    const photos = await photo.find({});
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

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/post", async (req, res) => {
    await photo.create(req.body);
    res.redirect("/");
})

const port = 3000;

app.listen(port, () => console.log(`Sunucu ${port} portunda çalıştı.`));