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

test("AirtableBase", async () => {
  const client = new AirtableClient({
    token: process.env.AIRTABLE_API_TOKEN,
  })

  const base = client.getBase(process.env.AIRTABLE_BASE_ID)
  const response = await base.getTableSchemas()

  expect(response instanceof AirtableClientResponse).toBe(true)
  expect(response.status).toBe(200)
  expect(response.json.tables.length).toBe(1)
  expect(response.json.tables[0].id).toBe(process.env.AIRTABLE_TABLE_ID)
})
