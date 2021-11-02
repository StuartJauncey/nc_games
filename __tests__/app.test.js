const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {

  test("status: 404 responds with an error not found error when passed a bad path", () => {
    return request(app)
    .get("/not a good path")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid URL");
    });
  });

  describe("/api/categories", () => {
    describe("GET", () => {
      test("status: 200 responds with an array of categories with the properties of slug and description", () => {
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

  describe("/api/reviews/:review_id", () => {
    describe("GET", () => {
      test("status: 200 responds with a review object which should have the following properties", () => {
        return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String)
          })
        })
      });
      test("status: 400 when passed an invalid review_id parameter type", () => {
        return request(app)
        .get("/api/reviews/hello")
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe("Invalid request");
        })
      })
      test("status: 404 when provided a valid review_id type but there is no corresponding review", () => {
        return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({ body: {msg} }) => {
          expect(msg).toBe("Review not found");
        }) 
      });
    });
  });
});
