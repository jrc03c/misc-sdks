import { AirtableClientResponse } from "../../response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import { MAX_RECORDS_PER_REQUEST } from "../common.mjs"
import { tableRef, TestRecord } from "./_set_up_and_tear_down_tests.mjs"

test("AirtableTableRef.batchUpdateRecordsSafely", async () => {
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
  response1.json.records.forEach((r, i) => (records[i].id = r.id))

  const updatedRecords = records.map(
    r =>
      new TestRecord({
        id: r.id,
        fields: {
          Name: r.fields.Name,
          Notes: Math.random().toString(),
        },
      }),
  )

  const response2 = await tableRef.batchUpdateRecordsSafely(updatedRecords)
  expect(response2 instanceof AirtableClientResponse).toBe(true)
  expect(response2.status).toBeLessThanOrEqualTo(204)

  expect(response2.json.responses.length).toBe(
    Math.ceil(updatedRecords.length / MAX_RECORDS_PER_REQUEST),
  )

  expect(
    response2.json.responses.every(v => v instanceof AirtableClientResponse),
  ).toBe(true)

  expect(response2.json.responses.every(v => v.status <= response2.status))

  const ids = updatedRecords.map(r => r.id)

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const r1 = records.find(r => r.id === id)
    const r2 = updatedRecords.find(r => r.id === id)
    const r3 = response2.json.records.find(r => r.id === id)
    expect(r3.fields.Assignee).toBe(r1.fields.Assignee)
    expect(r3.fields.Name).toBe(r1.fields.Name)
    expect(r3.fields.Notes).not.toBe(r1.fields.Notes)
    expect(r3.fields.Notes).toBe(r2.fields.Notes)
    expect(r3.fields.Status).toBe(r1.fields.Status)
  }
})
