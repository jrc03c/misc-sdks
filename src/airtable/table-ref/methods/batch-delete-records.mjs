import { batchUploadCore } from "./batch-upload-core.mjs"

function batchDeleteRecords(tableRef, ids, options, progress) {
  return batchUploadCore(
    tableRef.deleteRecords.bind(tableRef),
    ids,
    options,
    progress,
  )
}

export { batchDeleteRecords }
