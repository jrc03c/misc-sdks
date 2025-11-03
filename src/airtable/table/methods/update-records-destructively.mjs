function updateRecordsDestructively(client, records, options) {
  return client.updateRecordsCore("PUT", records, options)
}

export { updateRecordsDestructively }
