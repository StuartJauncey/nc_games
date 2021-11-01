const fetchCategories = require("../models/categories");

exports.getCategories = (req, res) => {
  fetchCategories()
  .then((categories) => {
    res.status(200).send({ categories });
  });
}