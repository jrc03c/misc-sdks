import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  tableRef,
  TestRecord,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { MAX_RECORDS_PER_REQUEST } from "../common.mjs"

test("AirtableTableRef.batchUpdateRecordsDestructively", async () => {
  const records = []

  for (let i = 0; i < 25; i++) {
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

  const response1 = await tableRef.batchCreateRecords(records)
  expect(response1.status).toBeLessThanOrEqualTo(204)

  const updatedRecords = records.map(
    (r, i) =>
      new TestRecord({
        id: response1.json.records[i].id,
        fields: {
          Name: r.fields.Name,
          Notes: Math.random().toString(),
        },
      }),
  )

  const response2 =
    await tableRef.batchUpdateRecordsDestructively(updatedRecords)

  expect(response2 instanceof AirtableClientResponse).toBe(true)
  expect(response2.status).toBeLessThanOrEqualTo(204)

  expect(response2.json.responses.length).toBe(
    Math.ceil(updatedRecords.length / MAX_RECORDS_PER_REQUEST),
  )

  expect(
    response2.json.responses.every(v => v instanceof AirtableClientResponse),
  ).toBe(true)

  expect(response2.json.responses.every(v => v.status <= response2.status))

  const keyToSortBy = "Notes"
  confirmRecordsAreEqual(response2.json.records, updatedRecords, keyToSortBy)
})
