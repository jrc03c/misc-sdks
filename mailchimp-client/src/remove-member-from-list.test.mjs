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

test("removeMemberFromList", async () => {
  const client = new MailchimpClient({
    apiKey: process.env.TEST_MAILCHIMP_API_KEY,
    serverPrefix: process.env.TEST_MAILCHIMP_SERVER_PREFIX,
  })

  const emailAddress = makeKey(12) + "@gmail.com"

  // confirm that the member is not already subscribed
  const status1 = await client.getMemberStatus(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )

  expect(status1).not.toBe("subscribed")

  // add the member to the list
  await client.addMemberToList(process.env.TEST_MAILCHIMP_LIST_ID, emailAddress)

  // confirm that the member is now subscribed
  const status2 = await client.getMemberStatus(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )

  expect(status2).toBe("subscribed")

  // remove the member from the list
  await client.removeMemberFromList(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )

  // confirm that the member is no longer subscribed
  const status3 = await client.getMemberStatus(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )

  expect(status3).not.toBe("subscribed")
})
