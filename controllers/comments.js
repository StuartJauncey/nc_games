const { fetchCommentsByReviewId } = require("../models/comments");

exports.getCommentsByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  fetchCommentsByReviewId(id)
  .then(comments => {
    res.status(200).send({ comments });
  })
  .catch(next);
}