const { getReviewById, patchReviewVotesById, getAllReviews } = require("../controllers/reviews");
const reviewsRouter = require("express").Router();

reviewsRouter
.route("/:review_id")
.get(getReviewById)
.patch(patchReviewVotesById)

reviewsRouter
.route("/")
.get(getAllReviews)

module.exports = reviewsRouter;