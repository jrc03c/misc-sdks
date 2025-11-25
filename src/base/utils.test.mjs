import { expect, test } from "@jrc03c/fake-jest"
import { isEqual } from "@jrc03c/js-math-tools"

import {
  EmailStandardizationOptions,
  standardizeEmailAddress,
  toNodemailerAddressFormat,
} from "./utils.mjs"

test("standardizeEmailAddress", () => {
  // non-email-address strings
  expect(standardizeEmailAddress("")).toBe("")
  expect(standardizeEmailAddress("someone")).toBe("someone")

  expect(standardizeEmailAddress("someone@a@b@c@example.com")).toBe(
    "someone@a@b@c@example.com",
  )

  // plain ol' email addresses
  expect(standardizeEmailAddress("someone@example.com")).toBe(
    "someone@example.com",
  )

  // upper-case
  expect(standardizeEmailAddress("SoMeOnE@eXaMpLe.CoM")).toBe(
    "someone@example.com",
  )

  // whitespace
  expect(standardizeEmailAddress("s o m e o n e @ e x a m p l e . c o m")).toBe(
    "someone@example.com",
  )

  // diacritical marks
  // (should be removed in username by default but not in domain name)
  expect(standardizeEmailAddress("sömeoné@exåmple.com")).toBe(
    "someone@exåmple.com",
  )

  expect(
    standardizeEmailAddress(
      "sömeoné@exåmple.com",
      new EmailStandardizationOptions({
        shouldRemoveDiacriticalMarksInUsername: false,
      }),
    ),
  ).toBe("sömeoné@exåmple.com")

  expect(
    standardizeEmailAddress(
      "sömeoné@exåmple.com",
      new EmailStandardizationOptions({
        shouldRemoveDiacriticalMarksInDomain: true,
      }),
    ),
  ).toBe("someone@xn--exmple-jua.com")

  // periods in username
  expect(standardizeEmailAddress("s.o.m.e.o.n.e@example.com")).toBe(
    "s.o.m.e.o.n.e@example.com",
  )

  expect(
    standardizeEmailAddress(
      "s.o.m.e.o.n.e@example.com",
      new EmailStandardizationOptions({
        shouldRemovePeriodsInUsername: true,
      }),
    ),
  ).toBe("someone@example.com")

  // tags in username
  expect(standardizeEmailAddress("someone+test@example.com")).toBe(
    "someone+test@example.com",
  )

  expect(
    standardizeEmailAddress(
      "someone+test@example.com",
      new EmailStandardizationOptions({
        shouldRemoveTagsInUsername: true,
      }),
    ),
  ).toBe("someone@example.com")

  const wrongs = [
    0,
    1,
    2.3,
    -2.3,
    234n,
    -234n,
    Infinity,
    -Infinity,
    NaN,
    true,
    false,
    null,
    undefined,
    Symbol.for("Hello, world!"),
    [2, 3, 4],
    [
      [2, 3, 4],
      [5, 6, 7],
    ],
    x => x,
    function (x) {
      return x
    },
    { hello: "world" },
    new Date(),
  ]

  for (let i = 0; i < wrongs.length; i++) {
    expect(() => standardizeEmailAddress(wrongs[i])).toThrow()
  }
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
        shouldRemoveDiacriticalMarksInDomain: true,
        shouldRemoveDiacriticalMarksInUsername: false,
      }),
      {
        address: "sömeoné@xn--exmple-jua.com",
        name: "sömeoné@xn--exmple-jua.com",
      },
    ),
  ).toBe(true)
})
