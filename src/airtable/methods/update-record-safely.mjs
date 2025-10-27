import { updateRecordsSafely } from "./update-records-safely.mjs"

function updateRecordSafely(record, options) {
  return updateRecordsSafely.bind(this)([record], options)
}

export { updateRecordSafely }
