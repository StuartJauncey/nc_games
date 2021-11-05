const { checkIfNum } = require("../util-functions");

describe("checkIfNum", () => {
  test("should return true if the value passed does evaluate to a number", () => {
    expect(checkIfNum("3")).toBe(true);
    expect(checkIfNum("hello")).toBe(false);
  });
});