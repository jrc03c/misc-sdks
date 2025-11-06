import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  defaultRecords,
  tableRef,
} from "./_set_up_and_tear_down_tests.mjs"

import { expect, test } from "@jrc03c/fake-jest"
import { shuffle } from "@jrc03c/js-math-tools"

test("AirtableTableRef.deleteRecords", async () => {
  await (async () => {
    const ids = shuffle(defaultRecords.map(r => r.id)).slice(0, 4)

    const response1 = await tableRef.deleteRecords(ids)
    expect(response1 instanceof AirtableClientResponse).toBe(true)
    expect(response1.status).toBeLessThanOrEqualTo(204)

    const response2 = await tableRef.getRecords()
    expect(response2.status).toBe(200)

    confirmRecordsAreEqual(
      response2.json.records,
      defaultRecords.filter(r => !ids.includes(r.id)),
    )
  })()

  // errors
  await (async () => {
    expect(async () => await tableRef.deleteRecords("nope")).toThrow()
    expect(async () => await tableRef.deleteRecords([12345])).toThrow()
  })()
})
