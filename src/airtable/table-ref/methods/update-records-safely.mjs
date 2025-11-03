function updateRecordsSafely(tableRef, records, options) {
  return tableRef.updateRecordsCore("PATCH", records, options)
}

export { updateRecordsSafely }
