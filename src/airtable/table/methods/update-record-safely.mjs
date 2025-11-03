function updateRecordSafely(client, record, options) {
  return client.updateRecordsSafely([record], options)
}

export { updateRecordSafely }
