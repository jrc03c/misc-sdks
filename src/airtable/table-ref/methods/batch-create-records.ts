import { batchUpdateCore } from "./batch-update-core.mjs"

function batchCreateRecords(tableRef, records, options, progress) {
  return batchUpdateCore(
    tableRef.createRecords.bind(tableRef),
    records,
    options,
    progress,
  )
}

export { batchCreateRecords }
