// search-list-tags.mjs

import { expect, test } from "@jrc03c/fake-jest"
import { MailchimpClient } from "../index.mjs"
import process from "node:process"

if (typeof process.env.MAILCHIMP_API_KEY === "undefined") {
  throw new Error("The environment variable MAILCHIMP_API_KEY is undefined!")
}

if (typeof process.env.MAILCHIMP_LIST_ID === "undefined") {
  throw new Error("The environment variable MAILCHIMP_LIST_ID is undefined!")
}

if (typeof process.env.MAILCHIMP_TEST_EMAIL_ADDRESS === "undefined") {
  throw new Error(
    "The environment variable MAILCHIMP_TEST_EMAIL_ADDRESS is undefined!",
  )
}

const client = new MailchimpClient({
  apiKey: process.env.MAILCHIMP_API_KEY,
})

const listId = process.env.MAILCHIMP_LIST_ID
const emailAddress = process.env.MAILCHIMP_TEST_EMAIL_ADDRESS

const tags = [
  "unit_test_please_ignore_8a5a61bc",
  "unit_test_please_ignore_b5ebd0d5",
]

test("MailchimpClient.getListMemberTags", async () => {
  const response = await client.getListMemberTags(listId, emailAddress)
  expect(response.status).toBeGreaterThanOrEqualTo(200)
  expect(response.status).toBeLessThanOrEqualTo(204)

  expect(!!response.json.tags.find(t => tags.some(v => t.name === v))).toBe(
    false,
  )
})

test("MailchimpClient.addTagsToListMember", async () => {
  await (async () => {
    const response = await client.addTagsToListMember(
      listId,
      emailAddress,
      tags,
    )

    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  await (async () => {
    const response = await client.getListMemberTags(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)

    expect(tags.every(v => !!response.json.tags.find(t => t.name === v))).toBe(
      true,
    )
  })()
})

test("MailchimpClient.removeTagsFromListMember", async () => {
  await (async () => {
    const response = await client.removeTagsFromListMember(
      listId,
      emailAddress,
      tags,
    )

    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  await (async () => {
    const response = await client.getListMemberTags(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)

    expect(!!response.json.tags.find(t => tags.some(v => t.name === v))).toBe(
      false,
    )
  })()
})

test("MailchimpClient.searchListTags", async () => {
  const response = await client.searchListTags(listId, tags[0])
  expect(response.status).toBeGreaterThanOrEqualTo(200)
  expect(response.status).toBeLessThanOrEqualTo(204)
  expect(response.json.tags.length).toBeGreaterThan(0)
})
