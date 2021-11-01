const db = require("../db/connection");

const fetchCategories = async () => {
  const { rows } = await db.query(
    'SELECT * FROM categories;'
  );
  return rows;
}

module.exports = fetchCategories;