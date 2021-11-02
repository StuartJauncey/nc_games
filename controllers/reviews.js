const { fetchReviewById, updateReviewVotesById, fetchAllReviews } = require("../models/reviews");

exports.getReviewById = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewById(id)
  .then((review) => {
    res.status(200).send({ review });
  })
  .catch(next);
}

exports.patchReviewVotesById = (req, res, next) => {
  const id = req.params.review_id;
  const voteChange = req.body;
  updateReviewVotesById(id, voteChange)
  .then((review) => {
    res.status(200).send({ review });
  })
  .catch(next);
}

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews()
  .then((reviews) => {
    res.status(200).send({ reviews });
  })
}