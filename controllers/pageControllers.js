const photo = require("../models/Photo");

exports.getAboutPage = (req, res) => {
  res.render("about");
};

exports.getAddPage = (req, res) => {
  res.render("add");
};

exports.getEditPage = async (req, res) => {
  const Photo = await photo.findById(req.params.id);
  res.render("edit", {
    Photo,
  });
};
