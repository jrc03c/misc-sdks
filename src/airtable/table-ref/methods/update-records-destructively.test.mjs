import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  defaultRecords,
  tableRef,
  TestRecord,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { shuffle } from "@jrc03c/js-math-tools"

test("AirtableTableRef.updateRecordsDestructively", async () => {
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

    const response1 = await tableRef.updateRecordsDestructively(records)
    expect(response1 instanceof AirtableClientResponse).toBe(true)
    expect(response1.status).toBeLessThanOrEqualTo(204)

    const response2 = await tableRef.getRecords(records.map(r => r.id))
    const keyToSortBy = "Notes"
    confirmRecordsAreEqual(response2.json.records, records, keyToSortBy)
  })()

  // errors
  await (async () => {
    expect(async () => await tableRef.updateRecordsDestructively()).toThrow()
    expect(async () => await tableRef.updateRecordsDestructively([])).toThrow()

    expect(
      async () => await tableRef.updateRecordsDestructively(["nope"]),
    ).toThrow()

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

    expect(
      async () => await tableRef.updateRecordsDestructively(records),
    ).toThrow()
  })()
})
