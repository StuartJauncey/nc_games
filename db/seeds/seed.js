const db = require("../connection");

const seed = async (data) => {
  //Drop tables if they exist
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query(`DROP TABLE IF EXISTS categories`);
  // 1. create tables
  await db
  .query(`
    CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR
    )
  ;`)
  // 2. insert data
};

module.exports = seed;
