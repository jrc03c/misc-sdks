import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  tableRef,
  TestRecord,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { MAX_RECORDS_PER_REQUEST } from "../common.mjs"

test("AirtableTableRef.batchCreateRecords", async () => {
  const newRecords = []

  for (let i = 0; i < 25; i++) {
    newRecords.push(
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

  const response = await tableRef.batchCreateRecords(newRecords)
  expect(response instanceof AirtableClientResponse).toBe(true)
  expect(response.status).toBeLessThanOrEqualTo(204)

  expect(response.json.responses.length).toBe(
    Math.ceil(newRecords.length / MAX_RECORDS_PER_REQUEST),
  )

  expect(
    response.json.responses.every(v => v instanceof AirtableClientResponse),
  ).toBe(true)

  expect(response.json.responses.every(v => v.status <= response.status))
  expect(response.json.records.length).toBe(newRecords.length)
  confirmRecordsAreEqual(response.json.records, newRecords)
})
