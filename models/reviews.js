const db = require("../db/connection");

const fetchReviewById = async (id) => {
  const { rows } = await db.query(
    `SELECT *
    FROM reviews
    WHERE review_id = $1
    ;`, [id]
  );
  return rows[0];
}

module.exports = fetchReviewById;