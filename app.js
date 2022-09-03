const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
const ejs = require("ejs");
const path = require("path");
const photoController = require("./controllers/photoControllers"); 
const pageController = require("./controllers/pageControllers");

const app = express();

// Connect DB
mongoose.connect(`mongodb+srv://yakup:gJZ8akYCvmVb6WaB@cluster0.vgg0plu.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log("DB connected!"))
    .catch((err) => console.log(err));

//MIDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

// TEMPLATE ENGINE
app.set("view engine", "ejs");

//ROUTES
app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.post("/post", photoController.createPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);
app.get("/photos/edit/:id", pageController.getEditPage);
app.get("/about", pageController.getAboutPage);
app.get("/add", pageController.getAddPage);


const port = process.env.Port || 5000;

app.listen(port, () => console.log(`Sunucu ${port} portunda çalıştı.`));