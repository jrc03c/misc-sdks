import { batchUpdateCore } from "./batch-update-core.mjs"

function batchDeleteRecords(tableRef, ids, options, progress) {
  return batchUpdateCore(
    tableRef.deleteRecords.bind(tableRef),
    ids,
    options,
    progress,
  )
}

export { batchDeleteRecords }
