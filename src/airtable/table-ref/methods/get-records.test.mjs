import { AirtableClientResponse } from "../../response.mjs"
import { defaultRecords, tableRef } from "./_set_up_and_tear_down_tests.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import { shuffle } from "@jrc03c/js-math-tools"

test("AirtableTableRef.getRecords", async () => {
  // without arguments
  await (async () => {
    const response = await tableRef.getRecords()
    expect(response instanceof AirtableClientResponse).toBe(true)
    expect(response.status).toBe(200)
    expect(response.json.records instanceof Array).toBe(true)
    expect(response.json.records.length).toBe(defaultRecords.length)
  })()

  // without `ids` argument
  await (async () => {
    const response1 = await tableRef.getRecords()
    expect(response1.status).toBe(200)

    const ids = shuffle(response1.json.records.map(r => r.id))
      .slice(0, 3)
      .toSorted((a, b) => (a < b ? -1 : 1))

    const response2 = await tableRef.getRecords(ids)
    expect(response2.status).toBe(200)

    expect(
      response2.json.records
        .map(r => r.id)
        .toSorted((a, b) => (a < b ? -1 : 1)),
    ).toStrictEqual(ids)
  })()
})
