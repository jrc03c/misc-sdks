import { updateRecordsCore } from "./update-records-core.mjs"

function updateRecordsDestructively(records, options) {
  return updateRecordsCore.bind(this)("PUT", records, options)
}

export { updateRecordsDestructively }
