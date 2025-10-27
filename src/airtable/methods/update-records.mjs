const MAX_RECORDS_PER_REQUEST = 10

function updateRecords(records, options) {
  // note:
  // - performs a PATCH request, which only updates included fields; i've
  //   created a separate method for *destructive* updates (i.e., updates that
  //   clear all unincluded fields) via PUT request
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
      `The array passed into the \`AirtableTable.updateRecords\` method must contain no more than ${MAX_RECORDS_PER_REQUEST} record objects!`,
    )
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    if (typeof record.id === "undefined") {
      throw new Error(
        "Each record object included in the array passed into the `AirtableTable.updateRecords` method must have an 'id' property with a string value representing the ID of an Airtable record!",
      )
    }

    if (typeof record.fields === "undefined") {
      throw new Error(
        "Each record object included in the array passed into the `AirtableTable.updateRecords` method must have a 'fields' property with an object value whose key-value pairs correspond to field names and values in the given table!",
      )
    }
  }

  options = options || {}
  delete options.performUpsert

  return this.client.patch(`/${this.base.id}/${this.id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...options,
      records,
    }),
  })
}

export { updateRecords }
