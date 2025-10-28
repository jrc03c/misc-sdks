const MAX_RECORDS_PER_REQUEST = 10

function updateRecordsCore(method, records, options) {
  // note:
  // - based on the `method` parameter, either performs a non-destructive update
  //   (PATCH) or a destructive update (PUT)
  // - only updates existing records; i've created a separate method for
  //   "upsert" behavior
  // - the `records` array must contain objects with 'id' and 'fields'
  //   properties
  // - deletes any undefined or empty string values in the records; otherwise
  //   airtable returns a 422 response
  // -----
  // https://airtable.com/developers/web/api/update-multiple-records#request
  // options include:
  // - performUpsert
  //   - fieldsToMergeOn
  // - returnFieldsByFieldId
  // - typecast

  if (typeof method !== "string") {
    throw new Error(
      "The first argument passed into the `updateRecordsCore` function must be a string with a value of either 'PATCH' or 'PUT'!",
    )
  }

  method = method.toLowerCase().trim()

  if (method !== "patch" && method !== "put") {
    throw new Error(
      "The first argument passed into the `updateRecordsCore` function must be a string with a value of either 'PATCH' or 'PUT'!",
    )
  }

  records = records || []

  if (records.length > MAX_RECORDS_PER_REQUEST) {
    throw new Error(
      `The array passed into the \`updateRecordsCore\` function must contain no more than ${MAX_RECORDS_PER_REQUEST} record objects!`,
    )
  }

  options = options || {}

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    if (typeof record !== "object") {
      throw new Error(
        "The array passed into the `updateRecordsCore` function must contain objects (representing records) with 'fields' properties!",
      )
    }

    if (
      typeof options.performUpsert === "undefined" &&
      typeof record.id === "undefined"
    ) {
      throw new Error(
        "Each record object included in the array passed into the `updateRecordsCore` function must have an 'id' property with a string value representing the ID of an Airtable record!",
      )
    }

    if (typeof record.fields === "undefined") {
      throw new Error(
        "Each record object included in the array passed into the `updateRecordsCore` function must have a 'fields' property with an object value whose key-value pairs correspond to field names and values in the given table!",
      )
    }

    const keys = Object.keys(record.fields)

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j]

      if (
        typeof record.fields[key] === "undefined" ||
        record.fields[key] === ""
      ) {
        delete record.fields[key]
      }
    }
  }

  return this.client[method](`/${this.base.id}/${this.id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...options,
      records,
    }),
  })
}

export { updateRecordsCore }
