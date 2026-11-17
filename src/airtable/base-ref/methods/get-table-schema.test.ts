import { baseRef, tableRef } from "./_set_up_and_tear_down_tests.mjs"
import { expect, test } from "@jrc03c/fake-jest"

test("AirtableBaseRef.getTableSchema", async () => {
  const response = await baseRef.getTableSchema(tableRef.id)
  expect(response.status).toBe(200)
  expect(response.json.id).toBe(tableRef.id)
})
