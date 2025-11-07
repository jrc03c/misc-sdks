import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  tableRef,
  TestRecord,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { PAGE_SIZE } from "../common.mjs"

test("AirtableTableRef.batchGetRecordsById", async () => {
  const newRecords = []

  for (let i = 0; i < 105; i++) {
    newRecords.push(
      new TestRecord({
        fields: {
          Name: Math.random().toString(),
          Notes: Math.random().toString(),
          Assignee: "SECRET",
          Status: "Done",
          DueDate: "1/1/1970",
        },
      }),
    )
  }

  await (async () => {
    const response = await tableRef.batchCreateRecords(newRecords)
    expect(response.status).toBeLessThanOrEqualTo(204)
    response.json.records.forEach((r, i) => (newRecords[i].id = r.id))
  })()

  await (async () => {
    const response = await tableRef.batchGetRecordsById(
      newRecords.map(r => r.id),
    )

    expect(response.status).toBeLessThanOrEqualTo(204)

    expect(response.json.responses.length).toBe(
      Math.ceil(newRecords.length / PAGE_SIZE),
    )

    expect(
      response.json.responses.every(v => v instanceof AirtableClientResponse),
    ).toBe(true)

    expect(response.json.responses.every(v => v.status <= response.status))

    const keyToSortBy = "Notes"
    confirmRecordsAreEqual(response.json.records, newRecords, keyToSortBy)
  })()
})
