import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  tableRef,
  TestRecord,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"

test("AirtableTableRef.createRecords", async () => {
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

    const response = await tableRef.createRecords(records)
    expect(response instanceof AirtableClientResponse).toBe(true)
    expect(response.status).toBe(200)
    confirmRecordsAreEqual(response.json.records, records)
  })()

  // errors
  await (async () => {
    expect(async () => await tableRef.createRecords()).toThrow()
    expect(async () => await tableRef.createRecords([])).toThrow()
    expect(async () => await tableRef.createRecords(["nope"])).toThrow()

    expect(
      async () => await tableRef.createRecords([{ Name: "nope" }]),
    ).toThrow()

    const records = []

    for (let i = 0; i < 100; i++) {
      records.push(
        new TestRecord({
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

    expect(async () => await tableRef.createRecords(records)).toThrow()
  })()
})
