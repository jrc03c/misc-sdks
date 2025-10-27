const MAX_RECORDS_PER_REQUEST = 10

function createRecords(records, options) {
  // note:
  // - the `records` array must contain objects with 'fields' properties
  // -----
  // https://airtable.com/developers/web/api/create-records#request
  // options include:
  // - fields (ignored)
  // - returnFieldsByFieldId
  // - typecast

  records = records || []

  if (records.length > MAX_RECORDS_PER_REQUEST) {
    throw new Error(
      `The array passed into the \`AirtableTable.createRecords\` method must contain no more than ${MAX_RECORDS_PER_REQUEST} record objects!`,
    )
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    if (typeof record !== "object") {
      throw new Error(
        "The array passed into the `AirtableTable.createRecords` method must contain objects (representing records) with 'fields' properties!",
      )
    }

    delete record.id

    if (typeof record.fields === "undefined") {
      throw new Error(
        "Each record object included in the array passed into the `AirtableTable.createRecords` method must have a 'fields' property with an object value whose key-value pairs correspond to field names and values in the given table!",
      )
    }
  }

  options = options || {}
  delete options.fields

  return this.client.post(`/${this.base.id}/${this.id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...options,
      records,
    }),
  })
}

export { createRecords }
