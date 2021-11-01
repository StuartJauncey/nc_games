const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
  // Drop tables if they exist
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query(`DROP TABLE IF EXISTS comments`);
  await db.query(`DROP TABLE IF EXISTS reviews`);
  await db.query(`DROP TABLE IF EXISTS users`);
  await db.query(`DROP TABLE IF EXISTS categories`);
  // Create tables
  await db
  .query(`
    CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR
    )
  ;`)
  await db
  .query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      avatar_url VARCHAR,
      name VARCHAR NOT NULL
    )
  ;`)
  await db
  .query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body VARCHAR NOT NULL,
      designer VARCHAR,
      review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category VARCHAR REFERENCES categories(slug),
      owner VARCHAR REFERENCES users(username),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  ;`)
  await db
  .query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR REFERENCES users(username),
      review_id INT REFERENCES reviews(review_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR NOT NULL
    )
  ;`)
  // 2. insert data
  const categoryString = format(
    `INSERT INTO categories (slug, description)
    VALUES
    %L RETURNING*;`,
    categoryData.map(category => {
      return [
        category.slug,
        category.description
      ];
    })
  )
  await db.query(categoryString)

  const userString = format(
    `INSERT INTO users (username, avatar_url, name)
    VALUES
    %L RETURNING *;`,
    userData.map(user => {
      return [
        user.username,
        user.avatar_url,
        user.name
      ]
    })
  )
  await db.query(userString)

  const reviewString = format(
    `INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at)
    VALUES
    %L RETURNING *;`,
    reviewData.map(review => {
      return [
        review.title,
        review.review_body,
        review.designer,
        review.review_img_url,
        review.votes,
        review.category,
        review.owner,
        review.created_at
      ]
    })
  )
  await db.query(reviewString);
};

module.exports = seed;
