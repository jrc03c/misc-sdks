import {
  isAnEmailAddress,
  parseSafe,
  standardizeEmailAddress,
} from "./utils.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { isEqual } from "@jrc03c/js-math-tools"

test("isAnEmailAddress", () => {
  const rights = [
    "someone@example.com",
    "s.o.m.e.o.n.e@example.com",
    "a@b.org",
    "someone+test@example.com",
  ]

  for (const value of rights) {
    expect(isAnEmailAddress(value)).toBe(true)
  }

  const wrongs = [
    "foo",
    "foo@bar",
    "foo@bar@baz.com",
    "...",
    "@",
    "...@...",
    "foo$bar.com",
    "@example.com",
    "someone@",
    "a@b.c",
    "1.2.3.4@5.6.7.8",
  ]

  for (const value of wrongs) {
    expect(isAnEmailAddress(value)).toBe(false)
  }
})

test("parseSafe", () => {
  expect(parseSafe(234)).toBe(234)
  expect(parseSafe("234")).toBe(234)
  expect(parseSafe("")).toBe("")

  expect(isEqual(parseSafe(`{"hello": "world"}`), { hello: "world" })).toBe(
    true,
  )

  expect(parseSafe("sldkfjsdlfj")).toBe("sldkfjsdlfj")
})

test("standardizeEmailAddress", () => {
  expect(standardizeEmailAddress("someone@example.com")).toBe(
    "someone@example.com",
  )

  expect(standardizeEmailAddress("SoMeOnE@eXaMpLe.CoM")).toBe(
    "someone@example.com",
  )

  expect(standardizeEmailAddress("SOMEONE@EXAMPLE.COM")).toBe(
    "someone@example.com",
  )

  expect(standardizeEmailAddress("         someone@example.com         ")).toBe(
    "someone@example.com",
  )
})
