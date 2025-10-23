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

test("MailchimpClient.addMemberToList", async () => {
  const client = new MailchimpClient({
    apiKey: process.env.MAILCHIMP_API_KEY,
  })

  const listId = process.env.MAILCHIMP_LIST_ID
  const emailAddress = process.env.MAILCHIMP_TEST_EMAIL_ADDRESS

  expect(
    (await client.getListMemberStatus(listId, emailAddress)).json,
  ).not.toBe(MailchimpClient.MemberStatus.SUBSCRIBED)

  await (async () => {
    const response = await client.addMemberToList(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  expect((await client.getListMemberStatus(listId, emailAddress)).json).toBe(
    MailchimpClient.MemberStatus.SUBSCRIBED,
  )

  await (async () => {
    const response = await client.archiveListMember(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  expect((await client.getListMemberStatus(listId, emailAddress)).json).toBe(
    MailchimpClient.MemberStatus.ARCHIVED,
  )
})
