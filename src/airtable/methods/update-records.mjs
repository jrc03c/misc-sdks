import { updateRecordsCore } from "./update-records-core.mjs"

function updateRecords(records, options) {
  return updateRecordsCore.bind(this)("PATCH", records, options)
}

export { updateRecords }
