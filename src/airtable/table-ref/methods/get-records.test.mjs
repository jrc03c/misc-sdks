import { AirtableClientResponse } from "../../response.mjs"

import {
  confirmRecordsAreEqual,
  defaultRecords,
  tableRef,
} from "./_set_up_and_tear_down_tests.mjs"

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

  // with `ids` argument
  await (async () => {
    const ids = shuffle(defaultRecords.map(r => r.id))
      .slice(0, 3)
      .toSorted((a, b) => (a < b ? -1 : 1))

    const response = await tableRef.getRecords(ids)
    expect(response.status).toBe(200)

    expect(
      response.json.records.map(r => r.id).toSorted((a, b) => (a < b ? -1 : 1)),
    ).toStrictEqual(ids)
  })()

  // with `options` argument
  await (async () => {
    const response = await tableRef.getRecords({
      filterByFormula: "{Status}='In progress'",
    })

    expect(response.status).toBe(200)

    confirmRecordsAreEqual(
      response.json.records,
      defaultRecords.filter(r => r.fields.Status === "In progress"),
    )
  })()

  // with both `ids` and `options` arguments
  await (async () => {
    const ids = defaultRecords.map(r => r.id)
    const options = { maxRecords: 3 }
    const response = await tableRef.getRecords(ids, options)
    expect(response.status).toBe(200)
    expect(response.json.records.length).toBe(options.maxRecords)
  })()
})
