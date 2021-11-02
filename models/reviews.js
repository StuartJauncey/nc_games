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

module.exports = fetchReviewById;