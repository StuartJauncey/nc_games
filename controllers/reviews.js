const fetchReviewById = require("../models/reviews");

exports.getReviewById = (req, res) => {
  const id = req.params.review_id;
  fetchReviewById(id)
  .then((review) => {
    res.status(200).send({ review });
  });
}