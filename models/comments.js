const db = require("../db/connection");

const fetchCommentsByReviewId = async (id) => {
  console.log(id);
  let queryStr = `
    SELECT comment_id, votes, created_at, author, body FROM comments 
  `;
  if (id) {
    queryStr += ` WHERE review_id = $1`
  }
  const { rows } = await db.query(queryStr, [id]);
  console.log(rows);
  return rows;
}

module.exports = { fetchCommentsByReviewId };