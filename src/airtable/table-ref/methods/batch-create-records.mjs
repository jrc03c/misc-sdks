import { batchUploadCore } from "./batch-upload-core.mjs"

function batchCreateRecords(tableRef, records, options, progress) {
  return batchUploadCore(
    tableRef.createRecords.bind(tableRef),
    records,
    options,
    progress,
  )
}

export { batchCreateRecords }
