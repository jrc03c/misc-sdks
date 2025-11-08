import { AirtableBaseRef } from "./base-ref/index.mjs"
import { AirtableClient } from "./index.mjs"
import { expect, test } from "@jrc03c/fake-jest"

test("AirtableClient", () => {
  expect(() => new AirtableClient()).toThrow()

  const client = new AirtableClient({ token: "foobar" })
  expect(client.apiVersion).toBe(0)
  expect(client.baseUrl).toBe("https://api.airtable.com/v0")
  expect(client.exponentialBackoffHelper.ms).toBe(1000 / 50)
  expect(client.token).toBe("foobar")

  const baseRef = client.getBaseRef("whatevs")
  expect(baseRef instanceof AirtableBaseRef).toBe(true)
  expect(baseRef.client).toBe(client)
  expect(baseRef.id).toBe("whatevs")
})
