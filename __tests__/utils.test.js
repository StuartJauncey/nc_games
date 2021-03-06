const { checkIfNum, checkIdExists, updateVotes } = require("../util-functions");

describe("checkIfNum", () => {
  test("should return true if the value passed does evaluate to a number", () => {
    expect(checkIfNum("3")).toBe(true);
  });
  test("should return false if the value passed does not evaluate to a number", () => {
    expect(checkIfNum("hello")).toBe(false);
  });
});

describe("checkIdExists", () => {
  test("should return true if the value passed is within the array when passed through parseInt", () => {
    expect(checkIdExists([1, 2, 3, 4, 5], "3")).toBe(true);
  });
  test("should return false if the value passed is not within the array when passed through parseInt", () => {
    expect(checkIdExists([1, 2, 3, 4, 5], "7")).toBe(false);
  });
});

describe("updateVotes", () => {
  test("should return a number of votes from an object updated by the inc_votes parameter", () => {
    expect(updateVotes([ { votes: 1 } ], 4)).toBe(5);
    expect(updateVotes([ { votes: 54 } ], -29)).toBe(25);
  })
});