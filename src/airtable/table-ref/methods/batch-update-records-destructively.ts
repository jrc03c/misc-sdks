import { batchUpdateCore } from "./batch-update-core.mjs"

function batchUpdateRecordsDestructively(tableRef, records, options, progress) {
  return batchUpdateCore(
    tableRef.updateRecordsDestructively.bind(tableRef),
    records,
    options,
    progress,
  )
}

export { batchUpdateRecordsDestructively }
