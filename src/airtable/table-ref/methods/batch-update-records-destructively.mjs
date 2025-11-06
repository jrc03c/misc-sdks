import { batchUploadCore } from "./batch-upload-core.mjs"

function batchUpdateRecordsDestructively(tableRef, records, options, progress) {
  return batchUploadCore(
    tableRef.updateRecordsDestructively.bind(tableRef),
    records,
    options,
    progress,
  )
}

export { batchUpdateRecordsDestructively }
