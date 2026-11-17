import { customCommaSplit } from "./custom-comma-split"
import { expect, test } from "vitest"

test("customCommaSplit", () => {
  expect(customCommaSplit("")).toStrictEqual([""])
  expect(customCommaSplit(`""`)).toStrictEqual([`""`])
  expect(customCommaSplit("hello world")).toStrictEqual(["hello world"])
  expect(customCommaSplit("hello,world")).toStrictEqual(["hello", "world"])
  expect(customCommaSplit("hello, world")).toStrictEqual(["hello", "world"])
  expect(customCommaSplit(`"hello, world"`)).toStrictEqual([`"hello, world"`])
  expect(customCommaSplit(`'hello, world'`)).toStrictEqual([`'hello`, `world'`])

  expect(customCommaSplit(`"hello, world", "foo, bar"`)).toStrictEqual([
    `"hello, world"`,
    `"foo, bar"`,
  ])

  expect(customCommaSplit(`"hello, world", foo, bar`)).toStrictEqual([
    `"hello, world"`,
    "foo",
    "bar",
  ])

  const addresses = [
    `"Bond, James" <007@mi6.gov.uk>`,
    `harry.potter@hogwarts.sch.uk`,
    `Eren Jaeger`,
    `ryuk@shinigami.realm`,
  ]

  expect(customCommaSplit(addresses.join(", "))).toStrictEqual(addresses)
})
