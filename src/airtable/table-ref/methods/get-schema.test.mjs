import { AirtableClientResponse } from "../../response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import { isEqual } from "@jrc03c/js-math-tools"
import { tableRef } from "./_set_up_and_tear_down_tests.mjs"

test("AirtableTableRef.getSchema", async () => {
  const response1 = await tableRef.getSchema()
  expect(response1 instanceof AirtableClientResponse).toBe(true)
  expect(response1.status).toBe(200)

  const response2 = await tableRef.baseRef.getTableSchema(tableRef.id)
  expect(response2.status).toBe(200)
  expect(isEqual(response1.json, response2.json)).toBe(true)
})
