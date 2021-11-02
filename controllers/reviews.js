const { fetchReviewById, updateReviewVotesById } = require("../models/reviews");

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