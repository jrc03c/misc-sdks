function updateRecordsDestructively(records, options) {
  return this.updateRecordsCore("PUT", records, options)
}

export { updateRecordsDestructively }
