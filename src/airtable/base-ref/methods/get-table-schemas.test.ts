import { baseRef, tableRef } from "./_set_up_and_tear_down_tests.mjs"
import { expect, test } from "@jrc03c/fake-jest"

test("AirtableBaseRef.getTableSchemas", async () => {
  const response = await baseRef.getTableSchemas()
  expect(response.status).toBe(200)
  expect(response.json.tables.length).toBeGreaterThan(0)
  expect(response.json.tables.map(t => t.id).includes(tableRef.id)).toBe(true)
})
