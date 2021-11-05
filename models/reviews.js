const db = require("../db/connection");
const { checkIfNum, checkIdExists, updateVotes } = require("../util-functions");

const fetchReviewById = async (id) => {
  if (!checkIfNum(id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

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
  const { inc_votes } = voteChange;

  if (!checkIfNum(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Invalid request object"});
  }

  let currentVotesQuery = `SELECT votes FROM reviews WHERE review_id = $1`;
  const currentVotes = await db.query(currentVotesQuery, [id]);

  const updatedVotes = updateVotes(currentVotes.rows, inc_votes);

  let queryStr = `UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`;
  const queryParams = [updatedVotes, id];

  const { rows } = await db.query(queryStr, queryParams);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return rows[0]
}


const fetchAllReviews = async (query) => {
  const { sort_by, order, category } = query;

  const columnHeaders = ["owner", "title", "review_id", "review_body", "designer", "review_img_url", "category", "created_at", "votes", "comment_count"];

  if (!columnHeaders.includes(sort_by) && query.hasOwnProperty("sort_by") && sort_by !== "") {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  let queryStr = `SELECT reviews.*,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  `

  if (query.hasOwnProperty("category")) {
    queryStr += `WHERE reviews.category = '${category}'`
  }

  queryStr += ` GROUP BY comments.review_id, reviews.review_id`

  let queryOrder = "DESC";
  if (query.hasOwnProperty("order")) {
    if (order !== "asc" && order !== "desc") {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
    if (order) { queryOrder = order };
  }
  
  let querySortColumn = "created_at";
  if (query.hasOwnProperty("sort_by")) {
    if (sort_by) { querySortColumn = sort_by; }
    queryStr += ` ORDER BY ${querySortColumn} ${queryOrder}`
  }

  const { rows } = await db.query(queryStr);

  const validCategoriesQuery = await db.query(`SELECT slug FROM categories`);
  const validCategories = validCategoriesQuery.rows.map(category => {
    return category.slug;
  })

  if (rows.length === 0) {
    if (checkIdExists(validCategories, category)) {
      return Promise.reject({ status: 404, msg: "No associated reviews with category"});
    }
    return Promise.reject({ status: 400, msg: "Invalid query"});
  }

  return rows;
}

module.exports = { fetchReviewById, updateReviewVotesById, fetchAllReviews };