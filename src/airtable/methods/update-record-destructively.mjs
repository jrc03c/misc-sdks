import { updateRecordsDestructively } from "./update-records-destructively.mjs"

function updateRecordDestructively(record, options) {
  return updateRecordsDestructively.bind(this)([record], options)
}

export { updateRecordDestructively }
