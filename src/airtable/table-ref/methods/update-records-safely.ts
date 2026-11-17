import { updateRecordsCore } from "./update-records-core.mjs"

function updateRecordsSafely(tableRef, records, options) {
  return updateRecordsCore(tableRef, "PATCH", records, options)
}

export { updateRecordsSafely }
