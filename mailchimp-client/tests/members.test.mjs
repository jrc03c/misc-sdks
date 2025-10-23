import { expect, test } from "@jrc03c/fake-jest"
import { MailchimpClient } from "../index.mjs"
import { makeKey } from "@jrc03c/make-key"
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

test("MailchimpClient.getListMemberStatus", async () => {
  expect(
    (await client.getListMemberStatus(listId, emailAddress)).json,
  ).not.toBe(MailchimpClient.MemberStatus.SUBSCRIBED)

  await (async () => {
    const tempEmailAddress = makeKey(8) + "@" + makeKey(8) + ".com"
    const response = await client.getListMemberStatus(listId, tempEmailAddress)
    expect(response.status).toBe(404)
    expect(response.json).toBe(MailchimpClient.MemberStatus.NOT_FOUND)
  })()
})

test("MailchimpClient.addMemberToList", async () => {
  await (async () => {
    const response = await client.addMemberToList(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  expect((await client.getListMemberStatus(listId, emailAddress)).json).toBe(
    MailchimpClient.MemberStatus.SUBSCRIBED,
  )
})

test("MailchimpClient.archiveListMember", async () => {
  await (async () => {
    const response = await client.archiveListMember(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  expect((await client.getListMemberStatus(listId, emailAddress)).json).toBe(
    MailchimpClient.MemberStatus.ARCHIVED,
  )
})

test("Mailchimp.batchAddMembersToList", async () => {
  await (async () => {
    const response = await client.batchAddMembersToList(listId, [emailAddress])
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

test("Mailchimp.searchMembers", async () => {
  const response = await client.searchMembers(emailAddress)
  expect(response.status).toBeGreaterThanOrEqualTo(200)
  expect(response.status).toBeLessThanOrEqualTo(204)
  expect(response.json.exact_matches.members.length).toBeGreaterThan(0)
})

test("Mailchimp.updateListMemberInfo", async () => {
  const language = "fr"

  await (async () => {
    const response = await client.updateListMemberInfo(listId, {
      email_address: emailAddress,
      language,
    })

    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  await (async () => {
    const response = await client.getListMemberInfo(listId, emailAddress)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.language).toBe(language)
  })()

  await (async () => {
    const response = await client.updateListMemberInfo(listId, {
      email_address: emailAddress,
      language: "en",
    })

    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()
})
