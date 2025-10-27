import { AirtableClient } from "../index.mjs"
import { AirtableClientResponse } from "../response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import process from "node:process"

if (typeof process.env.AIRTABLE_API_TOKEN === "undefined") {
  throw new Error("The environment variable `AIRTABLE_API_TOKEN` is undefined!")
}

if (typeof process.env.AIRTABLE_BASE_ID === "undefined") {
  throw new Error("The environment variable `AIRTABLE_BASE_ID` is undefined!")
}

if (typeof process.env.AIRTABLE_TABLE_ID === "undefined") {
  throw new Error("The environment variable `AIRTABLE_TABLE_ID` is undefined!")
}

test("AirtableTable", async () => {
  const client = new AirtableClient({
    token: process.env.AIRTABLE_API_TOKEN,
  })

  const base = client.getBase(process.env.AIRTABLE_BASE_ID)
  const table = base.getTable(process.env.AIRTABLE_TABLE_ID)
  const recordIds = []

  await (async () => {
    const response = await table.getRecords()
    expect(response instanceof AirtableClientResponse).toBe(true)
    expect(response.status).toBe(200)
    expect(response.json.records.length).toBeGreaterThan(0)
    recordIds.push(...response.json.records.map(r => r.id))
  })()

  await (async () => {
    const response = await table.getRecord(recordIds[0])
    expect(response.status).toBe(200)
    expect(response.json.id).toBe(recordIds[0])
  })()
})
