const { fetchCommentsByReviewId, addCommentToReview, removeCommentById, updateCommentVotesById } = require("../models/comments");

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
  .catch(next);
}

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  removeCommentById(id)
  .then(() => {
    res.status(204).send();
  })
  .catch(next);
}

exports.patchCommentVotesById = (req, res, next) => {
  const id = req.params.comment_id;
  const voteChange = req.body;
  updateCommentVotesById(id, voteChange)
  .then((comment) => {
    res.status(200).send({ comment });
  })
  .catch(next);
}