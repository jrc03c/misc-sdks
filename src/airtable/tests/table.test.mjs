import { afterAll, expect, test } from "@jrc03c/fake-jest"
import { AirtableClient } from "../index.mjs"
import { AirtableClientResponse } from "../response.mjs"
import { range, shuffle } from "@jrc03c/js-math-tools"
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
  id = ""

  fields = {
    Name: "",
    Notes: "",
    Assignee: "",
    Status: "",
    DueDate: "",
  }

  constructor(data) {
    data = data || {}
    data.fields = data.fields || {}

    this.id = data.id || this.id
    this.fields.Name = data.fields.Name || this.fields.Name
    this.fields.Notes = data.fields.Notes || this.fields.Notes
    this.fields.Assignee = data.fields.Assignee || this.fields.Assignee
    this.fields.Status = data.fields.Status || this.fields.Status
    this.fields.DueDate = data.fields.DueDate || this.fields.DueDate
  }

  get formattedDueDate() {
    if (!this.fields.DueDate) {
      return ""
    }

    const [month, day, year] = this.fields.DueDate.split("/")
    return [year, month, day].map(v => v.padStart(2, "0")).join("-")
  }

  copy() {
    return new TestRecord(this)
  }
}

function confirmRecordsAreEqual(rpred, rtrue) {
  if (rpred instanceof Array) {
    expect(rtrue instanceof Array).toBe(true)
    expect(rpred.length).toBe(rtrue.length)

    rpred.sort((a, b) => (a.fields["Assignee"] < b.fields["Assignee"] ? -1 : 1))
    rtrue.sort((a, b) => (a.fields["Assignee"] < b.fields["Assignee"] ? -1 : 1))

    for (let i = 0; i < rpred.length; i++) {
      confirmRecordsAreEqual(rpred[i], rtrue[i])
    }

    return
  }

  const keysPred = Object.keys(rpred.fields)

  for (let i = 0; i < keysPred.length; i++) {
    const key = keysPred[i]

    if (key.includes("DueDate")) {
      continue
    }

    const valuePred =
      typeof rpred.fields[key] === "undefined"
        ? new TestRecord().fields[key]
        : rpred.fields[key]

    const valueTrue = rtrue.fields[key]
    expect(valuePred).toBe(valueTrue)
  }

  const datePred = rpred.fields["DueDate"] || ""
  const dateTrue = rtrue.formattedDueDate
  expect(datePred).toBe(dateTrue)
}

const existingRecords = [
  new TestRecord({
    id: "recVtAq7FyF3aiPn2",
    fields: {
      Name: "Build the website",
      Notes: "No notes.",
      Assignee: "Alice",
      Status: "In progress",
      DueDate: "10/15/2025",
    },
  }),
  new TestRecord({
    id: "recULFTi5IauwT0vt",
    fields: {
      Name: "Rotate the widgets",
      Notes: "Hurry!",
      Assignee: "Betty",
      Status: "Todo",
      DueDate: "10/2/2025",
    },
  }),
  new TestRecord({
    id: "recMfGDoQVhB3GU8G",
    fields: {
      Name: "Analyze the data",
      Notes: "...",
      Assignee: "Cheryl",
      Status: "Todo",
      DueDate: "9/3/2025",
    },
  }),
  new TestRecord({
    id: "recOumm7q9VhjZk1I",
    fields: {
      Name: "Check and respond to emails",
      Notes: "[none]",
      Assignee: "Dana",
      Status: "In progress",
      DueDate: "10/5/2025",
    },
  }),
  new TestRecord({
    id: "recdinOb9A5ZlrfBn",
    fields: {
      Name: "Foo all the bars",
      Notes: "???",
      Assignee: "Emily",
      Status: "Done",
      DueDate: "1/1/1970",
    },
  }),
  new TestRecord({
    id: "recMhOGIFcMOXAixO",
    fields: {
      Name: "Chuck wood",
      Notes: "",
      Assignee: "Fatima",
      Status: "Todo",
      DueDate: "",
    },
  }),
]

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

  // get a single record
  await (async () => {
    const response = await table.getRecord("recVtAq7FyF3aiPn2")
    expect(response.status).toBe(200)
    confirmRecordsAreEqual(response.json, existingRecords[0])
  })()

  // get multiple records
  await (async () => {
    const response = await table.getRecords()
    expect(response instanceof AirtableClientResponse).toBe(true)
    expect(response.status).toBe(200)
    expect(response.json.records.length).toBe(existingRecords.length)
    confirmRecordsAreEqual(response.json.records, existingRecords)
    recordIds.push(...response.json.records.map(r => r.id))
  })()

  // create a single record
  await (async () => {
    const record = new TestRecord({
      fields: {
        Name: "X all the Ys",
        Notes: Math.random().toString(),
        Assignee: "Isabel",
        Status: "Done",
        DueDate: "1/1/2026",
      },
    })

    const response = await table.createRecord(record)
    expect(response.status).toBe(200)
    confirmRecordsAreEqual(response.json, record)

    recordIds.push(response.json.id)
    recordsIdsToDelete.push(response.json.id)
  })()

  // create multiple records
  await (async () => {
    const records = [
      new TestRecord({
        fields: {
          Name: "Find the meaning of life, the universe, and everything",
          Notes: Math.random().toString(),
          Assignee: "Gertrude",
          Status: "In progress",
          DueDate: "3/15/2025",
        },
      }),
      new TestRecord({
        fields: {
          Name: "Clean your room",
          Notes: Math.random().toString(),
          Assignee: "Hilda",
          Status: "Todo",
          DueDate: "6/9/2025",
        },
      }),
    ]

    const response = await table.createRecords(records)
    expect(response.status).toBe(200)
    confirmRecordsAreEqual(response.json.records, records)

    const ids = response.json.records.map(r => r.id)
    recordIds.push(...ids)
    recordsIdsToDelete.push(...ids)
  })()

  // update a single record safely
  await (async () => {
    const index = Math.floor(Math.random() * existingRecords.length)
    const original = existingRecords[index]
    const record = original.copy()
    record.fields.Name = "Update safely!"
    record.fields.Assignee = "Josh"

    const response1 = await table.updateRecordSafely(record)
    expect(response1.status).toBe(200)

    const response2 = await table.getRecord(original.id)
    expect(response2.status).toBe(200)
    confirmRecordsAreEqual(response2.json, record)

    const response3 = await table.updateRecordSafely(original)
    expect(response3.status).toBe(200)

    const response4 = await table.getRecord(original.id)
    expect(response4.status).toBe(200)
    confirmRecordsAreEqual(response4.json, original)
  })()

  // update multiple records safely
  await (async () => {
    const indices = shuffle(range(0, existingRecords.length).toArray()).slice(
      0,
      3,
    )

    const originals = indices.map(i => existingRecords[i])

    const records = originals.map(r => {
      r = r.copy()
      r.fields.Notes = Math.random().toString()
      return r
    })

    const response1 = await table.updateRecordsSafely(records)
    expect(response1.status).toBe(200)

    const response2 = await table.getRecords(records.map(r => r.id))
    expect(response2.status).toBe(200)
    confirmRecordsAreEqual(response2.json.records, records)

    const response3 = await table.updateRecordsSafely(originals)
    expect(response3.status).toBe(200)

    const response4 = await table.getRecords(originals.map(r => r.id))
    expect(response4.status).toBe(200)
    confirmRecordsAreEqual(response4.json.records, originals)
  })()

  // update a single record destructively

  // update multiple records destructively

  // delete a single record

  // delete multiple records
})
