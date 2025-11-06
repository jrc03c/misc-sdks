import { AirtableClientResponse } from "../../response.mjs"

import {
  defaultRecords,
  tableRef,
  TestRecord,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { shuffle } from "@jrc03c/js-math-tools"

test("AirtableTableRef.updateRecordsSafely", async () => {
  await (async () => {
    const records = shuffle(defaultRecords)
      .slice(0, 3)
      .map(
        r =>
          new TestRecord({
            id: r.id,
            fields: {
              Name: r.name,
              Notes: Math.random().toString(),
            },
          }),
      )

    const response1 = await tableRef.updateRecordsSafely(records)
    expect(response1 instanceof AirtableClientResponse).toBe(true)
    expect(response1.status).toBeLessThanOrEqualTo(204)

    const ids = records.map(r => r.id)
    const response2 = await tableRef.getRecords(ids)
    expect(response2.status).toBe(200)

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const r1 = defaultRecords.find(r => r.id === id)
      const r2 = records.find(r => r.id === id)
      const r3 = response2.json.records.find(r => r.id === id)
      expect(r3.fields.Assignee).toBe(r1.fields.Assignee)
      expect(r3.fields.Name).toBe(r1.fields.Name)
      expect(r3.fields.Notes).toBe(r2.fields.Notes)
      expect(r3.fields.Status).toBe(r1.fields.Status)
    }
  })()

  // errors
  await (async () => {
    expect(async () => await tableRef.updateRecordsSafely()).toThrow()
    expect(async () => await tableRef.updateRecordsSafely([])).toThrow()
    expect(async () => await tableRef.updateRecordsSafely(["nope"])).toThrow()

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

    expect(async () => await tableRef.updateRecordsSafely(records)).toThrow()
  })()
})
