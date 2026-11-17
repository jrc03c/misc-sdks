import { expect, test } from "@jrc03c/fake-jest"
import { customEncodeURIComponent } from "./utils.mjs"

test("customEncodeURIComponent", () => {
  expect(customEncodeURIComponent(234)).toBe("234")
  expect(customEncodeURIComponent(-234.567)).toBe("-234.567")
  expect(customEncodeURIComponent(NaN)).toBe("NaN")
  expect(customEncodeURIComponent(Infinity)).toBe("Infinity")
  expect(customEncodeURIComponent("foo")).toBe("foo")

  expect(customEncodeURIComponent("someone@example.com")).toBe(
    "someone%40example.com",
  )

  expect(customEncodeURIComponent(true)).toBe("true")
  expect(customEncodeURIComponent(false)).toBe("false")
  expect(customEncodeURIComponent(null)).toBe("null")
  expect(customEncodeURIComponent(undefined)).toBe("undefined")
  expect(customEncodeURIComponent(true)).toBe("true")

  expect(customEncodeURIComponent([2, 3, 4])).toBe("[]=2&[]=3&[]=4")
  expect(customEncodeURIComponent({ foo: "bar" })).toBe("foo=bar")
  expect(customEncodeURIComponent({ x: [2, 3, 4] })).toBe("x[]=2&x[]=3&x[]=4")

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

  const yPred = customEncodeURIComponent(x)
  expect(yPred).toBe(yTrue)
})
