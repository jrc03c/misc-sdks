import { batchUpdateCore } from "./batch-update-core.mjs"

function batchUpdateRecordsSafely(tableRef, records, options, progress) {
  return batchUpdateCore(
    tableRef.updateRecordsSafely.bind(tableRef),
    records,
    options,
    progress,
  )
}

export { batchUpdateRecordsSafely }
