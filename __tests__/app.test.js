const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe.only("app", () => {
  describe("/api/categories", () => {
    describe("GET", () => {
      test("status:200 responds with an array of categories with the properties of slug and description", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body:{ categories } }) => {
          expect(categories.length).toBe(4);
          expect(categories).toBeInstanceOf(Array);
          categories.forEach(category => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
            });
          })
        });
      });
    });
  });
});
