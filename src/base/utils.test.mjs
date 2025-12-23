import { expect, test } from "@jrc03c/fake-jest"
import { isEqual } from "@jrc03c/js-math-tools"

import { customCommaSplit, toNodemailerAddressFormat } from "./utils.mjs"

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

test("toNodemailerAddressFormat", () => {
  expect(
    isEqual(toNodemailerAddressFormat("someone@example.com"), {
      address: "someone@example.com",
      name: "someone@example.com",
    }),
  ).toBe(true)

  expect(
    isEqual(toNodemailerAddressFormat("Foo Bar <someone@example.com>"), {
      address: "someone@example.com",
      name: "Foo Bar",
    }),
  ).toBe(true)

  expect(
    isEqual(toNodemailerAddressFormat(`"Bar, Foo" <someone@example.com>`), {
      address: "someone@example.com",
      name: `Bar, Foo`,
    }),
  ).toBe(true)

  expect(
    isEqual(
      toNodemailerAddressFormat({
        address: "someone@example.com",
        name: "Foo Bar",
      }),
      {
        address: "someone@example.com",
        name: "Foo Bar",
      },
    ),
  ).toBe(true)

  expect(
    isEqual(
      toNodemailerAddressFormat([
        `alice@example.com`,
        `Bob <bob@example.com>`,
        { address: "cindy@example.com", name: "Cindy Lu Who" },
      ]),
      [
        { address: "alice@example.com", name: "alice@example.com" },
        { address: "bob@example.com", name: "Bob" },
        { address: "cindy@example.com", name: "Cindy Lu Who" },
      ],
    ),
  ).toBe(true)

  expect(
    isEqual(
      toNodemailerAddressFormat(
        [
          `"Alice" <alice@example.com>`,
          `Bob <bob@example.com>`,
          `cindy@example.com`,
        ].join(", "),
      ),
      [
        { address: "alice@example.com", name: "Alice" },
        { address: "bob@example.com", name: "Bob" },
        { address: "cindy@example.com", name: "cindy@example.com" },
      ],
    ),
  ).toBe(true)

  expect(
    isEqual(toNodemailerAddressFormat("sömeoné@exåmple.com"), {
      address: "someone@exåmple.com",
      name: "someone@exåmple.com",
    }),
  ).toBe(true)

  expect(
    isEqual(
      toNodemailerAddressFormat("sömeoné@exåmple.com", true, {
        shouldConvertDomainToPunycode: true,
        shouldRemoveDiacriticalMarksInUsername: false,
      }),
      {
        address: "sömeoné@xn--exmple-jua.com",
        name: "sömeoné@xn--exmple-jua.com",
      },
    ),
  ).toBe(true)
})
