import { updateRecords } from "./update-records.mjs"

function updateRecord(record, options) {
  return updateRecords.bind(this)([record], options)
}

export { updateRecord }
