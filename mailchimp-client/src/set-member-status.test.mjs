import { expect, test } from "@jrc03c/fake-jest"
import { makeKey } from "@jrc03c/make-key"
import { MailchimpClient } from "./index.mjs"
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

test("setMemberStatus", async () => {
  const client = new MailchimpClient({
    apiKey: process.env.TEST_MAILCHIMP_API_KEY,
    serverPrefix: process.env.TEST_MAILCHIMP_SERVER_PREFIX,
  })

  const emailAddress = makeKey(12) + "@gmail.com"
  const statuses = ["unsubscribed", "cleaned", "pending", "subscribed"]

  for (const statusTrue of statuses) {
    await client.setMemberStatus(
      process.env.TEST_MAILCHIMP_LIST_ID,
      emailAddress,
      statusTrue,
    )

    const statusPred = await client.getMemberStatus(
      process.env.TEST_MAILCHIMP_LIST_ID,
      emailAddress,
    )

    expect(statusPred).toBe(statusTrue)
  }

  await client.removeMemberFromList(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )
})
