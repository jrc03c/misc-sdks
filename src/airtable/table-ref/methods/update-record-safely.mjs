function updateRecordSafely(tableRef, record, options) {
  return tableRef.updateRecordsSafely([record], options)
}

export { updateRecordSafely }
