import { expect, test } from "@jrc03c/fake-jest"
import { MailTmClient } from "./index.mjs"
import { MailTmClientResponse } from "./response.mjs"
import process from "node:process"

const { MAIL_TM_ADDRESS, MAIL_TM_PASSWORD } = process.env

if (typeof MAIL_TM_ADDRESS === "undefined") {
  throw new Error("The environment variable `MAIL_TM_ADDRESS` is undefined!")
}

if (typeof MAIL_TM_PASSWORD === "undefined") {
  throw new Error("The environment variable `MAIL_TM_PASSWORD` is undefined!")
}

test("`MailTmClient`", async () => {
  // method: `authenticate`
  await (async () => {
    const client = new MailTmClient()

    const response = await client.authenticate(
      MAIL_TM_ADDRESS,
      MAIL_TM_PASSWORD,
    )

    expect(response instanceof MailTmClientResponse).toBe(true)
    expect(typeof response.data).toBe("object")
    expect(typeof response.data.id).toBe("string")
    expect(typeof response.data.token).toBe("string")
    expect(response.method).toBe("POST")
    expect(response.path).toBe("/token")
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(client.id).toBe(response.data.id)
    expect(client.token).toBe(response.data.token)
  })()

  // method: `fetch`
  await (async () => {
    const client = new MailTmClient()
    expect(async () => await client.fetch("/messages")).toThrow()
  })()
})
