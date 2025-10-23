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

test("MailchimpClient.getListInfo", async () => {
  const client = new MailchimpClient({
    apiKey: process.env.MAILCHIMP_API_KEY,
  })

  const listId = process.env.MAILCHIMP_LIST_ID
  const response = await client.getListInfo(listId)
  expect(response.status).toBeGreaterThanOrEqualTo(200)
  expect(response.status).toBeLessThanOrEqualTo(204)
})
