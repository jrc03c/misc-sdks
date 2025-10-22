import { expect, test } from "@jrc03c/fake-jest"
import { MailchimpClient } from "./index.mjs"
import { makeKey } from "@jrc03c/make-key"
import process from "node:process"

if (!process.env.TEST_MAILCHIMP_API_KEY) {
  throw new Error(
    "The environment variable `TEST_MAILCHIMP_API_KEY` is not defined!",
  )
}

if (!process.env.TEST_MAILCHIMP_EMAIL_ADDRESS) {
  throw new Error(
    "The environment variable `TEST_MAILCHIMP_EMAIL_ADDRESS` is not defined!",
  )
}

if (!process.env.TEST_MAILCHIMP_LIST_ID) {
  throw new Error(
    "The environment variable `TEST_MAILCHIMP_LIST_ID` is not defined!",
  )
}

if (!process.env.TEST_MAILCHIMP_SERVER_PREFIX) {
  throw new Error(
    "The environment variable `TEST_MAILCHIMP_SERVER_PREFIX` is not defined!",
  )
}

test("getMemberInfo", async () => {
  const client = new MailchimpClient({
    apiKey: process.env.TEST_MAILCHIMP_API_KEY,
    serverPrefix: process.env.TEST_MAILCHIMP_SERVER_PREFIX,
  })

  const info1 = await client.getMemberInfo(
    process.env.TEST_MAILCHIMP_LIST_ID,
    process.env.TEST_MAILCHIMP_EMAIL_ADDRESS,
  )

  expect(info1.status).toBe("subscribed")

  const info2 = await client.getMemberInfo(
    process.env.TEST_MAILCHIMP_LIST_ID,
    makeKey(8) + "@" + makeKey(8) + ".com",
  )

  expect(info2.status).toBe("does-not-exist")
})
