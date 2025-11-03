function updateRecordsDestructively(tableRef, records, options) {
  return tableRef.updateRecordsCore("PUT", records, options)
}

export { updateRecordsDestructively }
