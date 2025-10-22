import { expect, test } from "@jrc03c/fake-jest"
import { GmailMessageSender } from "../base-client/utils.mjs"
import { MailTmClient } from "./index.mjs"
import { MailTmClientResponse } from "./response.mjs"
import { makeKey } from "@jrc03c/make-key"
import { pause } from "@jrc03c/pause"
import process from "node:process"

if (typeof process.env.GMAIL_USER === "undefined") {
  throw new Error("The environment variable `GMAIL_USER` is undefined!")
}

if (typeof process.env.GMAIL_PASS === "undefined") {
  throw new Error("The environment variable `GMAIL_PASS` is undefined!")
}

if (typeof process.env.MAIL_TM_ADDRESS === "undefined") {
  throw new Error("The environment variable `MAIL_TM_ADDRESS` is undefined!")
}

if (typeof process.env.MAIL_TM_PASSWORD === "undefined") {
  throw new Error("The environment variable `MAIL_TM_PASSWORD` is undefined!")
}

test("MailTmClient", async () => {
  const gmail = new GmailMessageSender({
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  })

  const mailtm = new MailTmClient({
    address: process.env.MAIL_TM_ADDRESS,
    password: process.env.MAIL_TM_PASSWORD,
  })

  await (async () => {
    const response = await mailtm.authenticate()
    expect(response instanceof MailTmClientResponse).toBe(true)
    expect(response.endpoint).toBe("https://api.mail.tm/token")
    expect(typeof response.json).toBe("object")
    expect(typeof response.json.id).toBe("string")
    expect(typeof response.json.token).toBe("string")
    expect(response.method).toBe("POST")
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(typeof response.text).toBe("string")
  })()

  await (async () => {
    const response = await mailtm.getTotalMessageCount()
    expect(response.json).toBe(0)
  })()

  await (async () => {
    const id = makeKey(8)

    await gmail.send({
      to: process.env.MAIL_TM_ADDRESS,
      subject: `Unit test (${id})`,
      html: `Hey! This email is just being used as part of unit test ${id}. Please ignore it (but don't delete it)!`,
    })

    await pause(30000)
  })()

  let messages

  await (async () => {
    messages = await mailtm.getAllMessages()
    expect(messages.length).toBe(1)
  })()

  await (async () => {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      const response = await mailtm.deleteMessage(message.id)
      expect(response.status).toBeGreaterThanOrEqualTo(200)
      expect(response.status).toBeLessThanOrEqualTo(204)
    }

    const response = await mailtm.getTotalMessageCount()
    expect(response.json).toBe(0)
  })()
})
