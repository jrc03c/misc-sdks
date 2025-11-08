import { AirtableClient } from "../../index.mjs"
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

const client = new AirtableClient({ token: process.env.AIRTABLE_API_TOKEN })
const baseRef = client.getBaseRef(process.env.AIRTABLE_BASE_ID)
const tableRef = baseRef.getTableRef(process.env.AIRTABLE_TABLE_ID)

export { baseRef, client, tableRef }
