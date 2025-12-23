import { afterAll, expect, test } from "@jrc03c/fake-jest"
import { BeehiivClient, BeehiivClientResponse } from "./index.mjs"
import { Logger } from "@jrc03c/logger"
import { makeKey } from "@jrc03c/make-key"
import { pause } from "@jrc03c/pause"
import { shuffle } from "@jrc03c/js-math-tools"
import process from "node:process"

if (typeof process.env.BEEHIIV_API_KEY === "undefined") {
  throw new Error("The environment variable `BEEHIIV_API_KEY` is undefined!")
}

if (typeof process.env.BEEHIIV_DEFAULT_PUBLICATION_ID === "undefined") {
  throw new Error(
    "The environment variable `BEEHIIV_DEFAULT_PUBLICATION_ID` is undefined!",
  )
}

const logsFile = "/tmp/@jrc03c-misc-sdks-beehiiv-tests.json"

const logger = new Logger({
  path: logsFile,
  shouldWriteToStdout: false,
})

const client = new BeehiivClient({
  apiKey: process.env.BEEHIIV_API_KEY,
})

const pubId = process.env.BEEHIIV_DEFAULT_PUBLICATION_ID
const emailAddress = `joshrcastle+${makeKey(8)}@gmail.com`
let subId

afterAll(async () => {
  const response = await client.deleteSubscriptionByEmailAddress(
    pubId,
    emailAddress,
  )

  if (response.status >= 400 && response.status !== 404) {
    throw new Error(`${response.status} : ${response.text}`)
  }

  console.log(`See logs for more info: ${logsFile}`)
})

test("BeehiivClient", async () => {
  logger.logInfo(
    `Using email address "${emailAddress}" for the Beehiiv unit tests.`,
  )

  // create a subscription
  await (async () => {
    const response = await client.createSubscription(pubId, emailAddress)
    expect(response instanceof BeehiivClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.data.status).toBe("validating")
    subId = response.json.data.id
    logger.logInfo(`The subscription ID for "${emailAddress}" is "${subId}".`)
  })()

  // get a subscription
  await (async () => {
    let response = await client.getSubscriptionById(pubId, subId)

    if (response.status >= 400) {
      throw new Error(`${response.status} : ${response.text}`)
    }

    while (response.json.data.status === "validating") {
      await pause(1000)
      response = await client.getSubscriptionById(pubId, subId)

      if (response.status >= 400) {
        throw new Error(`${response.status} : ${response.text}`)
      }
    }

    expect(response instanceof BeehiivClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
    expect(response.json.data.status).toBe("active")
  })()

  // update a subscription
  await (async () => {
    // first, get the list of custom fields
    const response1 = await client.get(`/publications/${pubId}/custom_fields`)

    if (response1.status >= 400) {
      throw new Error(`${response1.status} : ${response1.text}`)
    }

    // select only the custom fields that are lists; and if there are none, then
    // just skip this test
    const fields = response1.json.data.filter(field => field.kind === "list")

    if (fields.length === 0) {
      return
    }

    // pick a random field, and generate a random value for it; then update the
    // subscription with the new value for the custom field
    const field = fields[Math.floor(Math.random() * fields.length)]
    const value = shuffle(field.options).slice(0, 3)

    const response2 = await client.updateSubscriptionById(pubId, subId, {
      customFields: [{ name: field.name, value }],
    })

    expect(response2 instanceof BeehiivClientResponse).toBe(true)
    expect(response2.status).toBeGreaterThanOrEqualTo(200)
    expect(response2.status).toBeLessThanOrEqualTo(204)
  })()

  // deactivate a subscription
  await (async () => {
    const response1 = await client.deactivateSubscriptionById(pubId, subId)
    expect(response1 instanceof BeehiivClientResponse).toBe(true)
    expect(response1.status).toBeGreaterThanOrEqualTo(200)
    expect(response1.status).toBeLessThanOrEqualTo(204)

    const response2 = await client.getSubscriptionById(pubId, subId)

    if (response2.status >= 400) {
      throw new Error(`${response2.status} : ${response2.text}`)
    }

    expect(response2.json.data.status).toBe("inactive")
  })()

  // delete a subscription
  await (async () => {
    const response = await client.deactivateSubscriptionById(pubId, subId)
    expect(response instanceof BeehiivClientResponse).toBe(true)
    expect(response.status).toBeGreaterThanOrEqualTo(200)
    expect(response.status).toBeLessThanOrEqualTo(204)
  })()
})
