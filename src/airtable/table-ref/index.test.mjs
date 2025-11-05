import { afterAll, beforeAll, expect, test } from "@jrc03c/fake-jest"
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

const client = new AirtableClient({
  token: process.env.AIRTABLE_API_TOKEN,
})

const base = client.getBaseRef(process.env.AIRTABLE_BASE_ID)
const table = base.getTableRef(process.env.AIRTABLE_TABLE_ID)
const recordsIdsToDelete = []

beforeAll(async () => {
  // delete any existing records
  while (true) {
    const response = await table.getRecords()

    if (response.status >= 400) {
      throw new Error(JSON.stringify(response))
    }

    if (response.json.records.length > 0) {
      const response2 = await table.deleteRecords(
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
  const response = await table.createRecords(defaultRecords)

  if (response.status >= 400) {
    throw new Error(JSON.stringify(response))
  }

  for (let i = 0; i < response.json.records.length; i++) {
    defaultRecords[i].id = response.json.records[i].id
  }
})

afterAll(async () => {
  await table.deleteRecords(recordsIdsToDelete)
  await table.updateRecordsDestructively(defaultRecords)
})

test("AirtableTableRef", async () => {
  const recordIds = []

  // get multiple records
  await (async () => {
    const response = await table.getRecords()
    expect(response instanceof AirtableClientResponse).toBe(true)
    expect(response.status).toBe(200)
    expect(response.json.records.length).toBe(defaultRecords.length)
    confirmRecordsAreEqual(response.json.records, defaultRecords)
    recordIds.push(...response.json.records.map(r => r.id))
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

  // update multiple records safely
  await (async () => {
    const indices = shuffle(
      range(0, defaultRecords.length - 1).toArray(),
    ).slice(0, 3)

    const originals = indices.map(i => defaultRecords[i])

    const records = originals.map(r => {
      r = r.copy()
      r.fields.Notes = Math.random().toString()
      return r
    })

    const response1 = await table.updateRecordsSafely(records)
    expect(response1.status).toBe(200)

    const response2 = await table.getRecords(records.map(r => r.id))
    expect(response2.status).toBe(200)
    confirmRecordsAreEqual(response2.json.records, records, "Notes")

    const response3 = await table.updateRecordsSafely(originals)
    expect(response3.status).toBe(200)

    const response4 = await table.getRecords(originals.map(r => r.id))
    expect(response4.status).toBe(200)
    confirmRecordsAreEqual(response4.json.records, originals)
  })()

  // update multiple records destructively
  await (async () => {
    const indices = shuffle(
      range(0, defaultRecords.length - 1).toArray(),
    ).slice(0, 3)

    const originals = indices.map(i => defaultRecords[i])

    const records = originals.map(r => {
      return new TestRecord({
        id: r.id,
        fields: {
          Notes: Math.random().toString(),
        },
      })
    })

    const response1 = await table.updateRecordsDestructively(records)
    expect(response1.status).toBe(200)

    const response2 = await table.getRecords(records.map(r => r.id))
    expect(response2.status).toBe(200)
    confirmRecordsAreEqual(response2.json.records, records, "Notes")

    const response3 = await table.updateRecordsDestructively(originals)
    expect(response3.status).toBe(200)

    const response4 = await table.getRecords(originals.map(r => r.id))
    expect(response4.status).toBe(200)
    confirmRecordsAreEqual(response4.json.records, originals)
  })()

  // delete multiple records
  await (async () => {
    const records = range(0, 3).map(
      () =>
        new TestRecord({
          fields: {
            Name: Math.random().toString(),
            Notes: Math.random().toString(),
            Assignee: Math.random().toString(),
            Status: "Todo",
            DueDate: "1/1/1970",
          },
        }),
    )

    const response1 = await table.createRecords(records)
    expect(response1.status).toBe(200)

    const ids = response1.json.records.map(r => r.id)
    const response2 = await table.deleteRecords(ids)
    expect(response2.status).toBe(200)

    const response3 = await table.getRecords(ids)
    expect(response3.status).toBe(200)
    expect(response3.json.records.length).toBe(0)
  })()

  // throw errors
  await (async () => {
    // too many records
    const records = []

    for (let i = 0; i < 100; i++) {
      records.push(
        new TestRecord({
          id: Math.random().toString(),
          fields: {
            Name: Math.random().toString(),
            Notes: Math.random().toString(),
            Assignee: Math.random().toString(),
            Status: "Done",
            DueDate: "1/1/1970",
          },
        }),
      )
    }

    expect(async () => await table.createRecords(records)).toThrow()
    expect(async () => await table.updateRecordsSafely(records)).toThrow()

    expect(
      async () => await table.deleteRecords(records.map(r => r.id)),
    ).toThrow()

    // invalid calls of the `getRecords` method
    expect(async () => await table.getRecords([2, 3, 4])).toThrow()
    expect(async () => await table.getRecords("foo")).toThrow()
    expect(async () => await table.getRecords(null, [2, 3, 4])).toThrow()
    expect(async () => await table.getRecords(null, "foo")).toThrow()

    expect(
      async () =>
        await table.getRecords(["a", "b", "c"], { filterByFormula: "nope" }),
    ).toThrow()
  })()
})
