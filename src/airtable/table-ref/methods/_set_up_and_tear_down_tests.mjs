import { afterAll, beforeAll, expect } from "@jrc03c/fake-jest"
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

class TestRecord {
  id = ""

  fields = {
    Assignee: "",
    DueDate: "",
    Name: "",
    Notes: "",
    Status: "",
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

function confirmRecordsAreEqual(rpred, rtrue, keyToSortBy) {
  if (rpred instanceof Array) {
    expect(rtrue instanceof Array).toBe(true)
    expect(rpred.length).toBe(rtrue.length)

    keyToSortBy = keyToSortBy || "Assignee"

    rpred = rpred.toSorted((a, b) =>
      a.fields[keyToSortBy] < b.fields[keyToSortBy] ? -1 : 1,
    )

    rtrue = rtrue.toSorted((a, b) =>
      a.fields[keyToSortBy] < b.fields[keyToSortBy] ? -1 : 1,
    )

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
      typeof rpred.fields[key] === "undefined" || rpred.fields[key] === ""
        ? new TestRecord().fields[key]
        : rpred.fields[key]

    const valueTrue = rtrue.fields[key]
    expect(valuePred).toBe(valueTrue)
  }

  const datePred = rpred.fields["DueDate"] || ""
  const dateTrue = rtrue.formattedDueDate
  expect(datePred).toBe(dateTrue)
}

const defaultRecords = [
  new TestRecord({
    fields: {
      Name: "Build the website",
      Notes: "No notes.",
      Assignee: "Alice",
      Status: "In progress",
      DueDate: "10/15/2025",
    },
  }),
  new TestRecord({
    fields: {
      Name: "Rotate the widgets",
      Notes: "Hurry!",
      Assignee: "Betty",
      Status: "Todo",
      DueDate: "10/2/2025",
    },
  }),
  new TestRecord({
    fields: {
      Name: "Analyze the data",
      Notes: "...",
      Assignee: "Cheryl",
      Status: "Todo",
      DueDate: "9/3/2025",
    },
  }),
  new TestRecord({
    fields: {
      Name: "Check and respond to emails",
      Notes: "[none]",
      Assignee: "Dana",
      Status: "In progress",
      DueDate: "10/5/2025",
    },
  }),
  new TestRecord({
    fields: {
      Name: "Foo all the bars",
      Notes: "???",
      Assignee: "Emily",
      Status: "Done",
      DueDate: "1/1/1970",
    },
  }),
  new TestRecord({
    fields: {
      Name: "Chuck wood",
      Notes: "",
      Assignee: "Fatima",
      Status: "Todo",
      DueDate: "1/1/2026",
    },
  }),
]

const client = new AirtableClient({ token: process.env.AIRTABLE_API_TOKEN })
const baseRef = client.getBaseRef(process.env.AIRTABLE_BASE_ID)
const tableRef = baseRef.getTableRef(process.env.AIRTABLE_TABLE_ID)

beforeAll(async () => {
  // delete any existing records
  while (true) {
    const response = await tableRef.getRecords()

    if (response.status >= 400) {
      throw new Error(JSON.stringify(response))
    }

    if (response.json.records.length > 0) {
      const response2 = await tableRef.deleteRecords(
        response.json.records.map(r => r.id),
      )

      if (response2.status >= 400) {
        throw new Error(JSON.stringify(response2))
      }
    } else {
      break
    }
  }

  // create the default records
  const response = await tableRef.createRecords(defaultRecords)

  if (response.status >= 400) {
    throw new Error(JSON.stringify(response))
  }

  for (let i = 0; i < response.json.records.length; i++) {
    defaultRecords[i].id = response.json.records[i].id
  }
})

afterAll(async () => {})

export {
  baseRef,
  client,
  confirmRecordsAreEqual,
  defaultRecords,
  tableRef,
  TestRecord,
}
