import { AirtableClient } from "../index.mjs"
import { AirtableClientResponse } from "../response.mjs"
import { AirtableTable } from "../table/index.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import { isEqual } from "@jrc03c/js-math-tools"
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

  const base = client.getBaseRef(process.env.AIRTABLE_BASE_ID)
  const response1 = await base.getTableSchemas()

  expect(response1 instanceof AirtableClientResponse).toBe(true)
  expect(response1.status).toBe(200)
  expect(response1.json.tables.length).toBe(1)
  expect(response1.json.tables[0].id).toBe(process.env.AIRTABLE_TABLE_ID)

  const response2 = await base.getTableSchema(process.env.AIRTABLE_TABLE_ID)
  expect(response2.status).toBe(200)
  expect(isEqual(response2.json, response1.json.tables[0])).toBe(true)

  const table = base.getTableRef(process.env.AIRTABLE_TABLE_ID)
  expect(table instanceof AirtableTable).toBe(true)
  expect(table.base).toBe(base)
  expect(table.client).toBe(client)
  expect(table.id).toBe(process.env.AIRTABLE_TABLE_ID)
})
