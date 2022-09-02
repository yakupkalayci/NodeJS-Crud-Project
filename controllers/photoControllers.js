const photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
  const photos = await photo.find({}).sort("-dateCreated");
  res.render("index", {
    photos,
  });
};

exports.getPhoto = async (req, res) => {
  const Photo = await photo.findById(req.params.id);
  res.render("photo", {
    Photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = "public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.photo;
  let uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
};

exports.updatePhoto = async (req, res) => {
  const Photo = await photo.findById(req.params.id);
  Photo.title = req.body.title;
  Photo.description = req.body.description;
  Photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const Photo = await photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + "/../public/" + Photo.image;
  fs.unlinkSync(deletedImage);

  await photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
};
