import { expect, test } from "@jrc03c/fake-jest"
import { superEncodeURIComponent } from "./utils.mjs"

test("superEncodeURIComponent", () => {
  expect(superEncodeURIComponent(234)).toBe("234")
  expect(superEncodeURIComponent(-234.567)).toBe("-234.567")
  expect(superEncodeURIComponent(NaN)).toBe("NaN")
  expect(superEncodeURIComponent(Infinity)).toBe("Infinity")
  expect(superEncodeURIComponent("foo")).toBe("foo")

  expect(superEncodeURIComponent("someone@example.com")).toBe(
    "someone%40example.com",
  )

  expect(superEncodeURIComponent(true)).toBe("true")
  expect(superEncodeURIComponent(false)).toBe("false")
  expect(superEncodeURIComponent(null)).toBe("null")
  expect(superEncodeURIComponent(undefined)).toBe("undefined")
  expect(superEncodeURIComponent(true)).toBe("true")

  expect(superEncodeURIComponent([2, 3, 4])).toBe("[]=2&[]=3&[]=4")
  expect(superEncodeURIComponent({ foo: "bar" })).toBe("foo=bar")
  expect(superEncodeURIComponent({ x: [2, 3, 4] })).toBe("x[]=2&x[]=3&x[]=4")

  const x = {
    message: "Hello, world!",
    foo: 12345,
    emails: ["a@b.com", "c@d.com", "e@f.com"],
    person: {
      name: {
        first: "Alice",
        last: "Jones",
      },
      email: "alice@example.com",
      age: 45,
    },
  }

  const yTrue = `message=Hello%2C%20world!&foo=12345&emails[]=a%40b.com&emails[]=c%40d.com&emails[]=e%40f.com&person.name.first=Alice&person.name.last=Jones&person.email=alice%40example.com&person.age=45`

  const yPred = superEncodeURIComponent(x)
  expect(yPred).toBe(yTrue)
})
