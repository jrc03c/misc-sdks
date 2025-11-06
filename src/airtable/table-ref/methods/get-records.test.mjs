import { AirtableClientResponse } from "../../response.mjs"
import { defaultRecords, tableRef } from "./_set_up_and_tear_down_tests.mjs"
import { expect, test } from "@jrc03c/fake-jest"

test("AirtableTableRef.getRecords", async () => {
  // without arguments
  await (async () => {
    const response = await tableRef.getRecords()
    expect(response instanceof AirtableClientResponse).toBe(true)
    expect(response.status).toBe(200)
    expect(response.json.records instanceof Array).toBe(true)
    expect(response.json.records.length).toBe(defaultRecords.length)
  })()
})
