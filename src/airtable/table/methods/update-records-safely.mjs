function updateRecordsSafely(client, records, options) {
  return client.updateRecordsCore("PATCH", records, options)
}

export { updateRecordsSafely }
