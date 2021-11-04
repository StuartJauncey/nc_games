const db = require("../db/connection");

const fetchCommentsByReviewId = async (id) => {
  const idType = isNaN(id);
  if (idType) {
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
    if (validReviews.includes(parseInt(id))) {
      return Promise.reject({ status: 200, msg: "Review has no associated comments" })
    }
    return Promise.reject({ status: 404, msg: "Review does not exist" });
  }


  return rows;
}

const addCommentToReview = async (id, newComment) => {
  console.log(id);
  console.log(newComment);
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

module.exports = { fetchCommentsByReviewId, addCommentToReview };