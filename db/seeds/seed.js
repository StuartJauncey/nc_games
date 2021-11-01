const db = require("../connection");

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
};

module.exports = seed;
