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
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            "review": {
              owner: 'mallionaire',
              title: 'Agricola',
              review_id: 1,
              review_body: 'Farmyard fun!',
              designer: 'Uwe Rosenberg',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              category: 'euro game',
              created_at: new Date(1610964020514),
              votes: 1
            }
          })
        })
      });
    });
  });
});
