import { afterAll, expect, test } from "@jrc03c/fake-jest"
import { Logger } from "@jrc03c/logger"
import { MailchimpClient, MailchimpClientResponse } from "./index.mjs"
import { MailTmClient } from "../mail-tm/index.mjs"
import { makeKey } from "@jrc03c/make-key"
import { pause } from "@jrc03c/pause"
import { range, shuffle } from "@jrc03c/js-math-tools"
import process from "node:process"

if (typeof process.env.MAILCHIMP_API_KEY === "undefined") {
  throw new Error("The environment variable `MAILCHIMP_API_KEY` is undefined!")
}

if (typeof process.env.MAILCHIMP_LIST_ID === "undefined") {
  throw new Error("The environment variable `MAILCHIMP_LIST_ID` is undefined!")
}

const mailchimp = new MailchimpClient({
  apiKey: process.env.MAILCHIMP_API_KEY,
})

const listId = process.env.MAILCHIMP_LIST_ID
const logsFile = "/tmp/@jrc03c-misc-sdks-mailchimp-tests.json"

const logger = new Logger({
  path: logsFile,
  shouldWriteToStdout: false,
})

const cleanupFns = []

const generateRandomMailTmCredentials = (() => {
  let domains

  return async () => {
    const mailtm = new MailTmClient()

    if (!domains) {
      const response = await mailtm.getDomains()

      if (response.status >= 400) {
        throw new Error(`(${response.status}) ${response.text}`)
      }

      domains = response.json["hydra:member"]
        .filter(v => v.isActive && !v.isPrivate)
        .map(v => v.domain)

      if (domains.length === 0) {
        throw new Error("No Mail.tm domains are available!")
      }
    }

    const domain = domains[Math.floor(Math.random() * domains.length)]
    const address = "unittest" + makeKey(8) + "@" + domain
    const password = makeKey(8)

    await (async () => {
      const response = await mailtm.createAccount(address, password)

      if (response.status >= 400) {
        throw new Error(`(${response.status}) ${response.text}`)
      }
    })()

    return { address, password }
  }
})()

afterAll(async () => {
  let errorCount = 0

  for (const fn of cleanupFns) {
    try {
      await fn()
    } catch (e) {
      logger.logError(e)
      errorCount++
    }
  }

  if (errorCount > 0) {
    throw new Error(
      `${errorCount} errors occurred during the cleanup process! Please consult the logs for more info: ${logsFile}`,
    )
  }

  console.log(`See logs for more info: ${logsFile}`)
})

test("MailchimpClient", async () => {
  // create random tags
  const tags = range(0, 3).map(() => "unit_test_delete_me_" + makeKey(8))

  // create random mail.tm accounts (to be used also as mailchimp list members)
  const members = []

  for (let i = 0; i < 4; i++) {
    const member = await generateRandomMailTmCredentials()
    member.isSubscribed = false
    members.push(member)

    logger.logInfo(
      `Created Mail.tm account "${member.address}" with password "${member.password}".`,
    )

    // remove all tags from the member's mailchimp profile
    cleanupFns.push(async () => {
      if (!member.isSubscribed) {
        return
      }

      const response = await mailchimp.removeTagsFromListMember(
        listId,
        member.address,
        tags,
      )

      if (response.status >= 400) {
        throw new Error(`(${response.status}) ${response.text}`)
      }

      logger.logInfo(`Removed tags from "${member.address}" in Mailchimp.`)
    })

    // unsubscribe (archive) the member in mailchimp
    cleanupFns.push(async () => {
      if (!member.isSubscribed) {
        return
      }

      const response = await mailchimp.archiveListMember(listId, member.address)

      if (response.status >= 400) {
        throw new Error(`(${response.status}) ${response.text}`)
      }

      logger.logInfo(`Archived "${member.address}" in Mailchimp.`)
    })

    // delete mail.tm account after tests finish running
    cleanupFns.push(async () => {
      const mailtm = new MailTmClient(member)
      const response = await mailtm.deleteAccount()

      if (response.status >= 400) {
        throw new Error(`(${response.status}) ${response.text}`)
      }

      logger.logInfo(`Deleted Mail.tm account "${member.address}".`)
    })
  }

  // get list info
  await (async () => {
    const response = await mailchimp.getListInfo(listId)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.id).toBe(listId)
  })()

  // search for tags (and expect no results)
  await (async () => {
    const response = await mailchimp.searchListTags(
      listId,
      tags[Math.floor(Math.random() * tags.length)],
    )

    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.tags.length).toBe(0)
  })()

  // search for members (and expect no results)
  await (async () => {
    const response = await mailchimp.searchMembers(
      members[Math.floor(Math.random() * members.length)].address,
    )

    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.exact_matches.members.length).toBe(0)
  })()

  // subscribe members one-at-a-time
  await (async () => {
    const member = members[0]
    const response = await mailchimp.addMemberToList(listId, member.address)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    member.isSubscribed = true
  })()

  // subscribe members in a batch
  await (async () => {
    const subset = members.slice(1)

    const response = await mailchimp.batchAddMembersToList(
      listId,
      subset.map(v => v.address),
    )

    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    subset.forEach(v => (v.isSubscribed = true))
  })()

  // in case the batch process takes a few seconds, we'll pause here to give it
  // time to process (though in theory it could take much longer!)
  await pause(5000)

  // apply tags to members
  await (async () => {
    for (const member of members) {
      const subset = shuffle(tags).slice(
        0,
        Math.floor(Math.random() * (tags.length - 1)) + 1,
      )

      const response = await mailchimp.addTagsToListMember(
        listId,
        member.address,
        subset,
      )

      expect(response instanceof MailchimpClientResponse).toBe(true)
      expect(response.status).toBeGreaterThanOrEqualTo(200)
      expect(response.status).toBeLessThanOrEqualTo(204)
    }
  })()

  // get member info
  await (async () => {
    const member = members[Math.floor(Math.random() * members.length)]
    const response = await mailchimp.getListMemberInfo(listId, member.address)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.email_address).toBe(member.address)
  })()

  // get member status
  await (async () => {
    const member = members[Math.floor(Math.random() * members.length)]
    const response = await mailchimp.getListMemberStatus(listId, member.address)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json).toBe("subscribed")
  })()

  // get member tags
  await (async () => {
    const member = members[Math.floor(Math.random() * members.length)]
    const response = await mailchimp.getListMemberTags(listId, member.address)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)

    expect(
      tags.some(tag => !!response.json.tags.find(v => v.name === tag)),
    ).toBe(true)
  })()

  // search for tags
  await (async () => {
    const tag = tags[Math.floor(Math.random() * tags.length)]
    const response = await mailchimp.searchListTags(listId, tag)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.tags.length).toBeGreaterThan(0)
  })()

  // search for members
  await (async () => {
    const member = members[Math.floor(Math.random() * members.length)]
    const response = await mailchimp.searchMembers(member.address)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.exact_matches.members.length).toBeGreaterThan(0)
  })()

  // remove member tags
  await (async () => {
    const member = members[Math.floor(Math.random() * members.length)]

    const response = await mailchimp.removeTagsFromListMember(
      listId,
      member.address,
      tags,
    )

    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()

  // unsubscribe (archive) members
  await (async () => {
    const member = members[Math.floor(Math.random() * members.length)]
    const response = await mailchimp.archiveListMember(listId, member.address)
    expect(response instanceof MailchimpClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    member.isSubscribed = false
  })()
})
