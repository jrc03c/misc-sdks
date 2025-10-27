import { createRecords } from "./create-records.mjs"

function createRecord(record, options) {
  return createRecords.bind(this)([record], options)
}

export { createRecord }
