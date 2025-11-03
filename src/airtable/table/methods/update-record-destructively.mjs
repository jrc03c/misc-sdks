function updateRecordDestructively(client, record, options) {
  return client.updateRecordsDestructively([record], options)
}

export { updateRecordDestructively }
