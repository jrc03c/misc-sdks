import { afterAll, expect, test } from "@jrc03c/fake-jest"

import {
  MailgunClient,
  MailgunClientResponse,
  MailgunEmailPayload,
} from "./index.mjs"

import { MailTmClient } from "../mail-tm/index.mjs"
import { pause } from "@jrc03c/pause"
import process from "node:process"

const mailgun = new MailgunClient({
  apiKey: process.env.MAILGUN_API_KEY,
  senderDomain: process.env.MAILGUN_SENDER_DOMAIN,
})

const mailtm = new MailTmClient({
  address: process.env.MAIL_TM_ADDRESS,
  password: process.env.MAIL_TM_PASSWORD,
})

const messageIdsToDelete = []

afterAll(async () => {
  for (const id of messageIdsToDelete) {
    await mailtm.deleteMessage(id)
  }
})

test("MailgunClient", async () => {
  expect(() => new MailgunClient()).toThrow()
  expect(() => new MailgunClient({ apiKey: "foo" })).toThrow()
  expect(() => new MailgunClient({ senderDomain: "example.com" })).toThrow()

  const to = process.env.MAIL_TM_ADDRESS
  const subject = `Unit Test (${Math.random().toString()})`
  const html =
    "This email was sent as part of a unit test suite and should be ignored."

  expect(MailgunEmailPayload.isPayloadish()).toBe(false)
  expect(MailgunEmailPayload.isPayloadish("foo@bar.com")).toBe(false)
  expect(MailgunEmailPayload.isPayloadish("Hello, world!")).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({})).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({ to })).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({ subject })).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({ html })).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({ html, to })).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({ html, subject })).toBe(false)
  expect(MailgunEmailPayload.isPayloadish({ subject, to })).toBe(true)

  await (async () => {
    const response = await mailgun.sendEmail({ to, subject, html })
    expect(response instanceof MailgunClientResponse).toBe(true)
    expect(response.status).toBe(200)
  })()

  let messageId = null

  await (async () => {
    const maxRetries = 5

    for (let retry = 0; retry < maxRetries; retry++) {
      const response = await mailtm.getMessages()
      expect(response.status).toBe(200)

      const messages = response.json["hydra:member"]

      for (let j = 0; j < messages.length; j++) {
        const message = messages[j]

        if (message.subject === subject) {
          messageId = message.id
          messageIdsToDelete.push(message.id)
          break
        }
      }

      if (messageId) {
        break
      }

      await pause(5000)
    }

    expect(!!messageId).toBe(true)
  })()

  await (async () => {
    const response = await mailtm.getMessage(messageId)
    expect(response.status).toBe(200)

    const message = response.json
    expect(message.to[0].address).toBe(to)
    expect(message.subject).toBe(subject)
    expect(message.html[0]).toBe(html)
  })()
})
