import { updateRecordsCore } from "./update-records-core.mjs"

function updateRecordsDestructively(tableRef, records, options) {
  return updateRecordsCore(tableRef, "PUT", records, options)
}

export { updateRecordsDestructively }
