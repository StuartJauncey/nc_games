const { deleteCommentById, patchCommentVotesById } = require("../controllers/comments");

const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentVotesById);

module.exports = commentsRouter;