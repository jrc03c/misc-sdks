function updateRecordsSafely(records, options) {
  return this.updateRecordsCore("PATCH", records, options)
}

export { updateRecordsSafely }
