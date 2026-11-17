import { AirtableClientResponse } from "../../response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import { MAX_RECORDS_PER_REQUEST } from "../common.mjs"
import { tableRef, TestRecord } from "./_set_up_and_tear_down_tests.mjs"

test("AirtableTableRef.batchDeleteRecords", async () => {
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

  const response1 = await tableRef.batchCreateRecords(newRecords)
  expect(response1.status).toBeLessThanOrEqualTo(204)

  const response2 = await tableRef.batchDeleteRecords(
    response1.json.records.map(r => r.id),
  )

  expect(response2 instanceof AirtableClientResponse).toBe(true)
  expect(response2.status).toBeLessThanOrEqualTo(204)

  expect(response2.json.responses.length).toBe(
    Math.ceil(newRecords.length / MAX_RECORDS_PER_REQUEST),
  )

  expect(
    response2.json.responses.every(v => v instanceof AirtableClientResponse),
  ).toBe(true)

  expect(response2.json.responses.every(v => v.status <= response2.status))
})
