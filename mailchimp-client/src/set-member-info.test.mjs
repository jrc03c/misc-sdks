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

test("setMemberInfo", async () => {
  const client = new MailchimpClient({
    apiKey: process.env.TEST_MAILCHIMP_API_KEY,
    serverPrefix: process.env.TEST_MAILCHIMP_SERVER_PREFIX,
  })

  const emailAddress = makeKey(12) + "@gmail.com"

  await client.addMemberToList(process.env.TEST_MAILCHIMP_LIST_ID, emailAddress)

  const infoTrue = {
    email_type: "text",
    language: "fr",
    vip: true,
  }

  await client.setMemberInfo(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
    infoTrue,
  )

  const infoPred = await client.getMemberInfo(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )

  expect(infoPred.email_type).toBe(infoTrue.email_type)
  expect(infoPred.language).toBe(infoTrue.language)
  expect(infoPred.vip).toBe(infoTrue.vip)

  await client.setMemberInfo(process.env.TEST_MAILCHIMP_LIST_ID, emailAddress, {
    email_type: "html",
    language: "en",
    vip: false,
  })

  await client.removeMemberFromList(
    process.env.TEST_MAILCHIMP_LIST_ID,
    emailAddress,
  )
})
