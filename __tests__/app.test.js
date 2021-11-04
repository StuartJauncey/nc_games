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

  describe("/api/reviews", () => {
    describe("GET", () => {
      test("status: 200 responds with an array of review objects with the correct properties", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach(review => {
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
        })
      });
     
      test("status: 200 responds with the reviews sorted by any valid column when passed a sort_by query", () => {
        return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({ body: {reviews} }) => {
          expect(reviews[0]).toEqual({
            "category": "social deduction",
            "comment_count": "3",
            "created_at": "2021-01-18T10:01:41.251Z",
            "designer": "Akihisa Okui",
            "owner": "bainesface",
            "review_body": "We couldn't find the werewolf!",
            "review_id": 3,
            "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            "title": "Ultimate Werewolf",
            "votes": 5,
          });
        });
      });
      test("status: 200 responds with the reviews sorted by any valid column when passed a sort_by query and an order", () => {
        return request(app)
        .get("/api/reviews?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: {reviews} }) => {
          expect(reviews[0]).toEqual({
            "category": "social deduction",
            "comment_count": "0",
            "created_at": "2021-01-18T10:01:41.251Z",
            "designer": "Wolfgang Warsch",
            "owner": "mallionaire",
            "review_body": "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
            "review_id": 9,
            "review_img_url": "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            "title": "A truly Quacking Game; Quacks of Quedlinburg",
            "votes": 10
          });
        });
      });
      test("status: 200 responds with the reviews sorted by the default of date when passed a sort_by query with no parameter but an order", () => {
        return request(app)
        .get("/api/reviews?sort_by&order=asc")
        .expect(200)
        .then(({ body: {reviews} }) => {
          expect(reviews[0]).toEqual({
            "category": "social deduction",
            "comment_count": "0",
            "created_at": "1970-01-10T02:08:38.400Z",
            "designer": "Klaus Teuber",
            "owner": "mallionaire",
            "review_body": "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
            "review_id": 13,
            "review_img_url": "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            "title": "Settlers of Catan: Don't Settle For Less",
            "votes": 16,
          });
        });
      });
      test("status: 200 responds with a filtered array of review objects with the correct properties when passed a specific category", () => {
        return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach(review => {
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
        })
      });
      test("status: 200 responds with an array of review objects with the correct properties when passed all the possible additional queries", () => {
        return request(app)
        .get("/api/reviews?sort_by=title&order=desc&category=social deduction")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach(review => {
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
        })
      });
      test('status: 400 when passed a sort_by column query that does not exist', () => {
        return request(app)
        .get("/api/reviews?sort_by=banana")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid query")
        });
      });
      test('status: 400 when passed an order query that is not asc or desc', () => {
        return request(app)
        .get("/api/reviews?order=diagonally")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid order query")
        });
      });
      test('status: 400 when passed a category query that does not exist', () => {
        return request(app)
        .get("/api/reviews?category=not a category")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid query")
        });
      });
      test.skip('status: 404 when passed a category query that does exist but has no reviews associated with it', () => {
        return request(app)
        .get("/api/reviews?category=children's games")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No associated reviews with category")
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

    describe("PATCH", () => {
      test('status: 200 when provided a valid request object and responds with the updated review', () => {
        const changeVotes = {
          inc_votes: 1
        };
        return request(app)
        .patch("/api/reviews/1")
        .send(changeVotes)
        .expect(200)
        .then(({ body: {review} }) => {
          expect(review).toEqual({
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            review_id: 1,
            owner: 'mallionaire',
            review_img_url:
      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 2
          })
        })
      });
      test('status: 400 when passed an invalid request object', () => {
        const changeVotes = {
          "bad_votes": 3
        }
        return request(app)
        .patch("/api/reviews/2")
        .send(changeVotes)
        .expect(400)
        .then(({ body:{msg} }) => {
          expect(msg).toBe("Invalid request object")
        });
      });
      test("status: 404 when provided a valid review_id type but there is no corresponding review", () => {
        const changeVotes = {
          inc_votes: 1
        }
        return request(app)
        .patch("/api/reviews/9999")
        .send(changeVotes)
        .expect(404)
        .then(({ body: {msg} }) => {
          expect(msg).toBe("Review not found");
        }) 
      });
    })
  });

  describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
      test("status: 200 responds with an array of comments from the given review_id", () => {
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: {comments} }) => {
          comments.forEach(comment => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            })
          })
        });
      });
      test("status: 400 responds with bad request if passed an invalid review_id type", () => {
        return request(app)
        .get("/api/reviews/notanumber/comments")
        .expect(400)
        .then(({ body: {msg} }) => {
          expect(msg).toBe("Invalid request");
        })
      });
      test("status: 404 responds with review does not exist if passed a review_id that does not exist", () => {
        return request(app)
        .get("/api/reviews/999/comments")
        .expect(404)
        .then(({ body: { msg }}) => {
          expect(msg).toBe("Review does not exist");
        })
      });
      test("status: 200 responds with no comments associated with this review if the review exists but has no comments", () => {
        return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body: { msg }}) => {
          expect(msg).toBe("Review has no associated comments");
        })
      });
    });
    describe("POST", () => {
      test("status: 201 responds with posted comment when passed a valid comment", () => {
        const comment = { username: "bainesface", body: "This game is good but not as good as Football Manager" };
        return request(app)
        .post("/api/reviews/1/comments")
        .send(comment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            body: expect.any(String),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            review_id: expect.any(Number),
            votes: expect.any(Number)
          })
        })
      });
    });
  });
});
