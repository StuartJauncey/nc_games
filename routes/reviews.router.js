const { getReviewById, patchReviewVotesById, getAllReviews } = require("../controllers/reviews");
const { getCommentsByReviewId, postCommentToReview } = require("../controllers/comments");
const reviewsRouter = require("express").Router();

reviewsRouter
.route("/:review_id")
.get(getReviewById)
.patch(patchReviewVotesById)

reviewsRouter
.route("/")
.get(getAllReviews)

reviewsRouter
.route("/:review_id/comments")
.get(getCommentsByReviewId)
.post(postCommentToReview)

module.exports = reviewsRouter;