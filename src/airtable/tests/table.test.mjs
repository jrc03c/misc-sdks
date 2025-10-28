import { afterAll, expect, test } from "@jrc03c/fake-jest"
import { AirtableClient } from "../index.mjs"
import { AirtableClientResponse } from "../response.mjs"
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

class TestRecord {
  fields = {
    Name: "",
    Notes: "",
    Assignee: "",
    Status: "",
    DueDate: "",
  }

  constructor(data) {
    data = data || {}
    this.fields.Name = data.Name || this.fields.Name
    this.fields.Notes = data.Notes || this.fields.Notes
    this.fields.Assignee = data.Assignee || this.fields.Assignee
    this.fields.Status = data.Status || this.fields.Status
    this.fields.DueDate = data.DueDate || this.fields.DueDate
  }
}

const client = new AirtableClient({
  token: process.env.AIRTABLE_API_TOKEN,
})

const base = client.getBase(process.env.AIRTABLE_BASE_ID)
const table = base.getTable(process.env.AIRTABLE_TABLE_ID)

const recordsIdsToDelete = []

afterAll(async () => {
  await table.deleteRecords(recordsIdsToDelete)
})

test("AirtableTable", async () => {
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

  await (async () => {
    const records = [
      new TestRecord({
        Name: "Find the meaning of life, the universe, and everything",
        Notes: Math.random().toString(),
        Assignee: "Gertrude",
        Status: "In progress",
        DueDate: "3/15/2025",
      }),
      new TestRecord({
        Name: "Clean your room",
        Notes: Math.random().toString(),
        Assignee: "Hilda",
        Status: "Todo",
        DueDate: "6/9/2025",
      }),
    ]

    const response = await table.createRecords(records)
    expect(response.status).toBe(200)
    expect(response.json.records.length).toBe(records.length)

    for (let i = 0; i < records.length; i++) {
      const rtrue = records[i]
      const rpred = response.json.records[i]
      const keys = Object.keys(rtrue.fields).filter(v => v !== "DueDate")

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j]
        expect(rpred.fields[key]).toBe(rtrue.fields[key])
      }
    }

    expect(response.json.records[0].fields["DueDate"]).toBe("2025-03-15")
    expect(response.json.records[1].fields["DueDate"]).toBe("2025-06-09")

    recordsIdsToDelete.push(...response.json.records.map(r => r.id))
  })()
})
