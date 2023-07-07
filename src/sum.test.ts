/**
 * @file sum.test.ts
 * @author dworac <mail@dworac.com>
 *
 * This file contains the unit testing for the sum function.
 */
import sum from "./sum";

test("sum", () => {
  expect(sum(1, 2)).toBe(3);
  expect(sum(1, 2)).not.toBe(4);
  expect(sum(-1, 2)).toBe(1);
  expect(sum(-1, -5)).toBe(-6);
});
