import { batchUploadCore } from "./batch-upload-core.mjs"

function batchUpdateRecordsSafely(tableRef, records, options, progress) {
  return batchUploadCore(
    tableRef.updateRecordsSafely.bind(tableRef),
    records,
    options,
    progress,
  )
}

export { batchUpdateRecordsSafely }
