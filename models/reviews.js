const db = require("../db/connection");

const fetchReviewById = async (id) => {
  const { rows } = await db.query(
    `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY comments.review_id, reviews.review_id
    ;`, [id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return rows[0];
}

const updateReviewVotesById = async (id, voteChange) => {
  if (typeof voteChange.inc_votes !== "number" || !voteChange.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "Invalid request object"});
  }

  let currentVotesQuery = `SELECT votes FROM reviews WHERE review_id = $1`;
  const currentVotes = await db.query(currentVotesQuery, [id]);

  let updatedVotes;
  if (currentVotes.rows.length === 0) {
    updatedVotes = 0;
  } else {
    updatedVotes = currentVotes.rows[0].votes + voteChange.inc_votes;
  }
  let queryStr = `UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`;
  const queryParams = [updatedVotes, id];
  const { rows } = await db.query(queryStr, queryParams);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return rows[0]
}

module.exports = { fetchReviewById, updateReviewVotesById };