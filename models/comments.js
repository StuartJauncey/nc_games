const db = require("../db/connection");
const { checkIfNum, checkIdExists, updateVotes } = require("../util-functions");

const fetchCommentsByReviewId = async (id) => {
  if (!checkIfNum(id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

  let queryStr = `
    SELECT comment_id, votes, created_at, author, body FROM comments 
  `;

  if (id) {
    queryStr += ` WHERE review_id = $1`
  }
  const { rows } = await db.query(queryStr, [id]);

  const validReviewsQuery = await db.query(`SELECT review_id FROM reviews;`);
  const validReviews = validReviewsQuery.rows.map(review => {
    return review.review_id;
  });
  
  if (rows.length === 0) {
    if (checkIdExists(validReviews, id)) {
      return Promise.reject({ status: 200, msg: "Review has no associated comments" })
    }
    return Promise.reject({ status: 404, msg: "Review does not exist" });
  }
  return rows;
}


const addCommentToReview = async (id, newComment) => {
  if (!newComment.hasOwnProperty("username") || !newComment.hasOwnProperty("body")) {
    return Promise.reject({ status: 400, msg: "Invalid post syntax" });
  }

  if (typeof newComment.body !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid body datatype"})
  }

  const { username, body } = newComment;

  let queryStr = `
    INSERT INTO comments
    (author, body, review_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
  `

  let queryParams = [username, body, id];

  const {rows} = await db.query(queryStr, queryParams);

  return rows[0];
}


const removeCommentById = async (id) => {
  let queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *
  `;

  const { rows } = await db.query(queryStr, [id]);
  
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment does not exist" });
  }
  return rows;
}

const updateCommentVotesById = async (id, voteChange) => {
  const { inc_votes } = voteChange;

  if (!checkIfNum(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Invalid request object"});
  }

  let currentVotesQuery = `SELECT votes FROM comments WHERE comment_id = $1`;
  const currentVotes = await db.query(currentVotesQuery, [id]);

  const updatedVotes = updateVotes(currentVotes.rows, inc_votes);

  let queryStr = `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *;`;
  const queryParams = [updatedVotes, id];

  const { rows } = await db.query(queryStr, queryParams);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return rows[0]
}

module.exports = { fetchCommentsByReviewId, addCommentToReview, removeCommentById, updateCommentVotesById };


