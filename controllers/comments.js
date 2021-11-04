const { fetchCommentsByReviewId, addCommentToReview } = require("../models/comments");

exports.getCommentsByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  fetchCommentsByReviewId(id)
  .then(comments => {
    res.status(200).send({ comments });
  })
  .catch(next);
}

exports.postCommentToReview = (req, res, next) => {
  const id = req.params.review_id;
  const newComment = req.body;
  addCommentToReview(id, newComment)
  .then(comment => {
    res.status(201).send({ comment });
  })
}