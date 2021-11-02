const { getReviewById, patchReviewVotesById } = require("../controllers/reviews");
const reviewsRouter = require("express").Router();

reviewsRouter
.route("/:review_id")
.get(getReviewById)
.patch(patchReviewVotesById)

module.exports = reviewsRouter;