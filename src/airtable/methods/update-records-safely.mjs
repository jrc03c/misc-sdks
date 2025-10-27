import { updateRecordsCore } from "./update-records-core.mjs"

function updateRecordsSafely(records, options) {
  return updateRecordsCore.bind(this)("PATCH", records, options)
}

export { updateRecordsSafely }
