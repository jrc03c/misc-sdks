const MAX_RECORDS_PER_REQUEST = 10

function updateRecordsDestructively(records, options) {
  // note:
  // - performs a PUT request, which is destructive (i.e., clears unincluded
  //   fields); i've created a separate method for non-destructive updates via
  //   PATCH request
  // - only updates existing records; i've created a separate method for
  //   "upsert" behavior
  // - the `records` array must contain objects with 'id' and 'fields'
  //   properties
  // -----
  // https://airtable.com/developers/web/api/update-multiple-records#request
  // options include:
  // - performUpsert (ignored)
  // - returnFieldsByFieldId
  // - typecast

  if (records.length > MAX_RECORDS_PER_REQUEST) {
    throw new Error(
      `The array passed into the \`AirtableTable.updateRecordsDestructively\` method must contain no more than ${MAX_RECORDS_PER_REQUEST} record objects!`,
    )
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    if (typeof record.id === "undefined") {
      throw new Error(
        "Each record object included in the array passed into the `AirtableTable.updateRecordsDestructively` method must have an 'id' property with a string value representing the ID of an Airtable record!",
      )
    }

    if (typeof record.fields === "undefined") {
      throw new Error(
        "Each record object included in the array passed into the `AirtableTable.updateRecordsDestructively` method must have a 'fields' property with an object value whose key-value pairs correspond to field names and values in the given table!",
      )
    }
  }

  options = options || {}
  delete options.performUpsert

  return this.client.put(`/${this.base.id}/${this.id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...options,
      records,
    }),
  })
}

export { updateRecordsDestructively }
