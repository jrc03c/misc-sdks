function updateRecordDestructively(tableRef, record, options) {
  return tableRef.updateRecordsDestructively([record], options)
}

export { updateRecordDestructively }
