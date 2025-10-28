import { AirtableClient } from "../index.mjs"
import { AirtableBase } from "../base/index.mjs"
import { expect, test } from "@jrc03c/fake-jest"

test("AirtableClient", () => {
  expect(() => new AirtableClient()).toThrow()

  const client = new AirtableClient({ token: "foobar" })
  expect(client.apiVersion).toBe(0)
  expect(client.baseUrl).toBe("https://api.airtable.com/v0")
  expect(client.exponentialBackoffHelper.ms).toBe(1000 / 50)
  expect(client.token).toBe("foobar")

  const base = client.getBaseRef("whatevs")
  expect(base instanceof AirtableBase).toBe(true)
  expect(base.client).toBe(client)
  expect(base.id).toBe("whatevs")
})
